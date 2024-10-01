import { notFound } from "next/navigation";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import ProductImageSlider from "@/components/singel/image-slider";
import { cache } from "react";
import SingleProductPage from "@/components/singel/ProductPage";
import { ProductShowcase } from "./_component/CategoryProductShowcase";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WP_CONSUMER_KEY!,
  consumerSecret: process.env.WP_CONSUMER_SECRET!,
  version: "wc/v3",
});

const getProduct = cache(async (id: string) => {
  try {
    const { data } = await api.get(`products/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
});

const getReviews = cache(async (productId: number) => {
  try {
    const { data } = await api.get(`products/reviews`, {
      product: productId,
      per_page: 10,
    });
    return data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
});

const getProductsInCategory = cache(
  async (categoryId: number, currentProductId: number, limit: number = 4) => {
    try {
      const { data } = await api.get("products", {
        category: categoryId,
        exclude: [currentProductId],
        per_page: limit,
      });
      return data;
    } catch (error) {
      console.error("Error fetching products in category:", error);
      return [];
    }
  }
);

const getLatestProductsInCategory = cache(
  async (categoryId: number, currentProductId: number, limit: number = 4) => {
    try {
      const { data } = await api.get("products", {
        category: categoryId,
        exclude: [currentProductId],
        per_page: limit,
        orderby: 'date',
        order: 'desc'
      });
      return data;
    } catch (error) {
      console.error("Error fetching latest products in category:", error);
      return [];
    }
  }
);

const getRandomProductsFromOtherCategories = cache(
  async (excludeCategoryId: number, limit: number = 4) => {
    try {
      const { data: categories } = await api.get("products/categories", {
        exclude: [excludeCategoryId],
        per_page: 100,
      });

      const randomCategories = categories
        .sort(() => 0.5 - Math.random())
        .slice(0, limit);

      const productsPromises = randomCategories.map(async (category: any) => {
        const { data } = await api.get("products", {
          category: category.id,
          per_page: 1,
        });
        return data[0];
      });

      const products = await Promise.all(productsPromises);
      return products.filter(Boolean);
    } catch (error) {
      console.error("Error fetching random products from other categories:", error);
      return [];
    }
  }
);

const getShippingZones = cache(async () => {
  try {
    const response = await api.get("shipping/zones");
    const zones = await Promise.all(
      response.data.map(async (zone: any) => {
        const methodsResponse = await api.get(
          `shipping/zones/${zone.id}/methods`
        );
        const price = methodsResponse.data[0]?.settings?.cost?.value || 0;
        return {
          id: zone.id,
          name: zone.name,
          price: parseFloat(price),
        };
      })
    );
    return zones;
  } catch (error) {
    console.error("Error fetching shipping zones:", error);
    return [];
  }
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.short_description.replace(/<[^>]*>/g, ""),
    openGraph: {
      images: [{ url: product.images[0]?.src }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, reviews, shippingZones] = await Promise.all([
    getProduct(params.id),
    getReviews(parseInt(params.id)),
    getShippingZones(),
  ]);

  if (!product) {
    notFound();
  }

  const categoryId = product.categories[0]?.id;

  const [productsInCategory, latestProductsInCategory, randomProducts] = await Promise.all([
    getProductsInCategory(categoryId, product.id),
    getLatestProductsInCategory(categoryId, product.id, 3),
    getRandomProductsFromOtherCategories(categoryId, 3)
  ]);

  const totalRating = reviews.reduce(
    (sum: number, review: any) => sum + review.rating,
    0
  );
  const averageRating =
    reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : "0.00";
  const ratingCount = reviews.length;

  const updatedProduct = {
    ...product,
    average_rating: averageRating,
    rating_count: ratingCount,
  };

  const formatProduct = (product: any) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    permalink: product.permalink,
    date_created: product.date_created,
    type: product.type,
    description: product.description,
    short_description: product.short_description,
    price: product.price,
    regular_price: product.regular_price,
    sale_price: product.sale_price,
    on_sale: product.on_sale,
    purchasable: product.purchasable,
    total_sales: product.total_sales,
    virtual: product.virtual,
    downloadable: product.downloadable,
    categories: product.categories,
    tags: product.tags,
    images: product.images,
    attributes: product.attributes,
    average_rating: product.average_rating,
    ratingCount: product.rating_count,
    stock_status: product.stock_status,
    brand: product.categories[0]?.name || "",
  });

  const formattedProductsInCategory = productsInCategory.map(formatProduct);
  const formattedLatestProducts = latestProductsInCategory.map(formatProduct);
  const formattedRandomProducts = randomProducts.map(formatProduct);

  const showcaseProducts = [...formattedLatestProducts, ...formattedRandomProducts];

  return (
    <section className="min-h-screen w-full">
      <SingleProductPage
        product={updatedProduct}
        shippingZones={shippingZones}
      />
      <section className="min-h-screen w-full">
        <h1 className="text-5xl text-center my-10">More Products in This Category</h1>
        <ProductImageSlider products={formattedProductsInCategory} />
      </section>
      <section className="my-[20vh]">
        <ProductShowcase
          title="Discover More Products"
          products={showcaseProducts}
          featuredImage={showcaseProducts[0]?.images[0]?.src || "/placeholder.jpg"}
          featuredTitle={`Explore Our Collection`}
          featuredDescription={`Discover the latest products from various categories.`}
        />
      </section>
    </section>
  );
}