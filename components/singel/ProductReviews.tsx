"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, ThumbsDown, Filter, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

interface Review {
  id: number;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  date_created: string;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [newReview, setNewReview] = useState({
    rating: 0,
    review: "",
    reviewer: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filters, setFilters] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    verified: false,
  });
  const [helpfulReviews, setHelpfulReviews] = useState<{
    [key: number]: "helpful" | "not-helpful" | null;
  }>({});
  const [displayedReviews, setDisplayedReviews] = useState<number>(10);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [reviews, sortBy, filters]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data);
      setFilteredReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    setDisplayedReviews((prevDisplayed) => prevDisplayed + 10);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating: newReview.rating,
          review: newReview.review,
          reviewer: newReview.reviewer,
          email: newReview.email,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }
      const data = await response.json();
      setReviews((prev) => [data, ...prev]);
      setNewReview({ rating: 0, review: "", reviewer: "", email: "" });
      setShowReviewForm(false);
      toast({
        title: "Success",
        description: "Your review has been submitted successfully!",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit review. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const recommendationPercentage =
    (reviews.filter((review) => review.rating >= 4).length / reviews.length) *
    100;

  const getRatingCount = (rating: number) =>
    reviews.filter((review) => Math.round(review.rating) === rating).length;

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handleRatingChange = (rating: number) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (key: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof filters],
    }));
  };

  const applyFiltersAndSort = () => {
    let filtered = reviews.filter((review) => {
      if (Object.values(filters).every((f) => f === false)) return true;
      return (
        filters[review.rating as keyof typeof filters] ||
        (filters.verified && review.verified)
      );
    });

    switch (sortBy) {
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.date_created).getTime() -
            new Date(a.date_created).getTime()
        );
    }

    setFilteredReviews(filtered);
    setDisplayedReviews(10);
  };

  const handleHelpfulClick = (
    reviewId: number,
    type: "helpful" | "not-helpful"
  ) => {
    setHelpfulReviews((prev) => ({
      ...prev,
      [reviewId]: prev[reviewId] === type ? null : type,
    }));
  };

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 py-8 bg-black text-white">
        <Skeleton className="h-10 w-1/3 mb-4 bg-gray-700" />
        <Skeleton className="h-4 w-1/4 mb-8 bg-gray-700" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="mb-4">
            <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
            <Skeleton className="h-20 w-full bg-gray-700" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-8 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center">
            <span className="text-3xl font-bold mr-2">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    averageRating >= star
                      ? "text-yellow-400 fill-current"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Based on {reviews.length} reviews
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">
            {recommendationPercentage.toFixed(0)}%
          </p>
          <p className="text-sm text-gray-400">would recommend this product</p>
        </div>
      </div>

      <div className="mb-8">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center mb-2">
            <span className="w-2 mr-2">{rating}</span>
            <Star className="w-4 h-4 text-gray-600 mr-2" />
            <Progress
              value={(getRatingCount(rating) / reviews.length) * 100}
              className="h-2 w-full max-w-xs"
            />
            <span className="ml-2 text-sm text-gray-400">
              {getRatingCount(rating)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                FILTERS
                <Filter className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 border-gray-300">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <Checkbox
                      id={`filter-${rating}`}
                      checked={filters[rating as keyof typeof filters]}
                      onCheckedChange={() =>
                        handleFilterChange(rating.toString())
                      }
                    />
                    <label
                      htmlFor={`filter-${rating}`}
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {rating} Star
                    </label>
                  </div>
                ))}
                <div className="flex items-center">
                  <Checkbox
                    id="filter-verified"
                    checked={filters.verified}
                    onCheckedChange={() => handleFilterChange("verified")}
                  />
                  <label
                    htmlFor="filter-verified"
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Verified Buyers
                  </label>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <select
            className="border border-gray-200 bg-black rounded px-2 py-1 text-sm text-white"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
        <Button onClick={() => setShowReviewForm(!showReviewForm)}>
          {showReviewForm ? "CANCEL" : "WRITE A REVIEW"}
        </Button>
      </div>

      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="mb-8 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
          <div className="flex items-center mb-4">
            <Label htmlFor="rating" className="mr-2">
              Your Rating:
            </Label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer transition-colors ${
                    newReview.rating >= star
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300 hover:text-yellow-200"
                  }`}
                  onClick={() => handleRatingChange(star)}
                />
              ))}
            </div>
          </div>
          <div className="grid gap-4 mb-4">
            <div>
              <Label htmlFor="reviewer">Your Name</Label>
              <Input
                id="reviewer"
                name="reviewer"
                value={newReview.reviewer}
                onChange={handleInputChange}
                required
                className="border-gray-200 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newReview.email}
                onChange={handleInputChange}
                required
                className="border-gray-300 text-white"
              />
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              name="review"
              value={newReview.review}
              onChange={handleInputChange}
              required
              rows={4}
              className="border-gray-300 text-white"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}

      <div className="space-y-6">
        {filteredReviews.slice(0, displayedReviews).map((review) => (
          <div key={review.id} className="border-b border-gray-300 pb-6">
            <div className="flex items-center mb-2">
              <Avatar className="w-10 h-10 mr-3">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${review.reviewer}`}
                  alt={review.reviewer}
                />
                <AvatarFallback>{review.reviewer.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{review.reviewer}</h4>
                {review.verified && (
                  <span className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded">
                    Verified Buyer
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    review.rating >= star
                      ? "text-yellow-400 fill-current"
                      : "text-gray-200"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-200">
                {new Date(review.date_created).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-300 mb-4">{review.review}</p>
            <div className="flex items-center text-sm text-gray-400">
              <Button
                variant="ghost"
                size="sm"
                className="mr-4 hover:text-white"
                onClick={() => handleHelpfulClick(review.id, "helpful")}
              >
                {helpfulReviews[review.id] === "helpful" ? (
                  <Check className="w-4 h-4 mr-1" />
                ) : (
                  <ThumbsUp className="w-4 h-4 mr-1" />
                )}
                {helpfulReviews[review.id] === "helpful"
                  ? "Marked as Helpful"
                  : "Helpful"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:text-white"
                onClick={() => handleHelpfulClick(review.id, "not-helpful")}
              >
                {helpfulReviews[review.id] === "not-helpful" ? (
                  <Check className="w-4 h-4 mr-1" />
                ) : (
                  <ThumbsDown className="w-4 h-4 mr-1" />
                )}
                {helpfulReviews[review.id] === "not-helpful"
                  ? "Marked as Not Helpful"
                  : "Not Helpful"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button
          onClick={handleLoadMore}
          variant="outline"
          disabled={displayedReviews >= filteredReviews.length}
        >
          {displayedReviews >= filteredReviews.length
            ? "No More Reviews"
            : "Load More Reviews"}
        </Button>
      </div>
    </div>
  );
}
