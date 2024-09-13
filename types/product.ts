export interface Product {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  categories: { id: number; name: string; slug: string }[];
  average_rating: string;
  images: { src: string }[];
  description: string;
  date_created: string;
  total_sales: number;
}