/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect } from "react"
import { Star, ThumbsUp, ThumbsDown, Filter, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"

interface Review {
  id: number
  reviewer: string
  reviewer_email: string
  review: string
  rating: number
  date_created: string
  verified: boolean
}

interface ProductReviewsProps {
  productId: number
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<string>("newest")
  const [newReview, setNewReview] = useState({
    rating: 0,
    review: "",
    reviewer: "",
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [filters, setFilters] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    verified: false,
  })
  const [helpfulReviews, setHelpfulReviews] = useState<{
    [key: number]: "helpful" | "not-helpful" | null
  }>({})
  const [displayedReviews, setDisplayedReviews] = useState<number>(5)

  useEffect(() => {
    fetchReviews()
  }, [productId])

  useEffect(() => {
    applyFiltersAndSort()
  }, [reviews, sortBy, filters])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`)
      if (!response.ok) throw new Error("Failed to fetch reviews")
      const data = await response.json()
      setReviews(data)
      setFilteredReviews(data)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadMore = () => {
    setDisplayedReviews((prevDisplayed) => prevDisplayed + 5)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
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
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit review")
      }
      const data = await response.json()
      setReviews((prev) => [data, ...prev])
      setNewReview({ rating: 0, review: "", reviewer: "", email: "" })
      setShowReviewForm(false)
      toast({
        title: "Success",
        description: "Your review has been submitted successfully!",
      })
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit review. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  const recommendationPercentage = (reviews.filter((review) => review.rating >= 4).length / reviews.length) * 100

  const getRatingCount = (rating: number) => reviews.filter((review) => Math.round(review.rating) === rating).length

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value)
  }

  const handleRatingChange = (rating: number) => {
    setNewReview((prev) => ({ ...prev, rating }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewReview((prev) => ({ ...prev, [name]: value }))
  }

  const handleFilterChange = (key: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof filters],
    }))
  }

  const applyFiltersAndSort = () => {
    let filtered = reviews.filter((review) => {
      if (Object.values(filters).every((f) => f === false)) return true
      return filters[review.rating as keyof typeof filters] || (filters.verified && review.verified)
    })

    switch (sortBy) {
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating)
        break
      default:
        filtered.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
    }

    setFilteredReviews(filtered)
    setDisplayedReviews(5)
  }

  const handleHelpfulClick = (reviewId: number, type: "helpful" | "not-helpful") => {
    setHelpfulReviews((prev) => ({
      ...prev,
      [reviewId]: prev[reviewId] === type ? null : type,
    }))
  }

  if (isLoading) {
    return (
      <div className="w-full bg-black text-white p-6 space-y-6">
        <Skeleton className="h-10 w-1/3 bg-gray-700" />
        <Skeleton className="h-4 w-1/4 bg-gray-700" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-700" />
            <Skeleton className="h-20 w-full bg-gray-700" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full bg-black text-white p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="flex flex-col">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    averageRating >= star ? "text-yellow-400 fill-current" : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-400">Based on {reviews.length} reviews</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{recommendationPercentage.toFixed(0)}%</p>
          <p className="text-sm text-gray-400">would recommend this product</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <span className="w-4 text-right">{rating}</span>
              <Star className="w-4 h-4 text-gray-600" />
              <Progress value={(getRatingCount(rating) / reviews.length) * 100} className="h-2 flex-grow" />
              <span className="text-sm text-gray-400 w-8">{getRatingCount(rating)}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-full md:w-auto">
                  FILTERS
                  <Filter className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 border-gray-700">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <Checkbox
                        id={`filter-${rating}`}
                        checked={filters[rating as keyof typeof filters]}
                        onCheckedChange={() => handleFilterChange(rating.toString())}
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
              className="border border-gray-700 text-white bg-black rounded px-2 py-1 text-sm"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
          <Button onClick={() => setShowReviewForm(!showReviewForm)} className="w-full">
            {showReviewForm ? "CANCEL" : "WRITE A REVIEW"}
          </Button>
        </div>
      </div>

      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="space-y-6 bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-semibold">Write a Review</h3>
          <div className="flex items-center space-x-2">
            <Label htmlFor="rating" className="w-24">Your Rating:</Label>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reviewer">Your Name</Label>
              <Input
                id="reviewer"
                name="reviewer"
                value={newReview.reviewer}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newReview.email}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              name="review"
              value={newReview.review}
              onChange={handleInputChange}
              required
              rows={4}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}

      <div className="space-y-6">
        {filteredReviews.slice(0, displayedReviews).map((review) => (
          <div key={review.id} className="border-b border-gray-700 pb-6">
            <div className="flex items-start space-x-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${review.reviewer}`} alt={review.reviewer} />
                <AvatarFallback>{review.reviewer.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{review.reviewer}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              review.rating >= star ? "text-yellow-400 fill-current" : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(review.date_created).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {review.verified && (
                    <span className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded">
                      Verified Buyer
                    </span>
                  )}
                </div>
                <div className="mt-2 text-gray-300" dangerouslySetInnerHTML={{ __html: review.review }} />
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-400">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-white"
                    onClick={() => handleHelpfulClick(review.id, "helpful")}
                  >
                    {helpfulReviews[review.id] === "helpful" ? (
                      <Check className="w-4 h-4 mr-1" />
                    ) : (
                      <ThumbsUp className="w-4 h-4 mr-1" />
                    )}
                    {helpfulReviews[review.id] === "helpful" ? "Marked as Helpful" : "Helpful"}
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
                    {helpfulReviews[review.id] === "not-helpful" ? "Marked as Not Helpful" : "Not Helpful"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayedReviews < filteredReviews.length && (
        <div className="text-center">
          <Button onClick={handleLoadMore} variant="outline" className="w-full md:w-auto">
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  )
}