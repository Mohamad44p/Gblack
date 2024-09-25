'use client'

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';

interface WishlistButtonProps {
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
    average_rating: string;
    rating_count: number;
    attributes?: { name: string; options: string[] }[];
    short_description: string;
  };
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        });
      } else {
        await addToWishlist({
          ...product,
          attributes: product.attributes || [],
        });
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist.`,
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        title: "Error",
        description: "There was an error updating your wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      variant="outline"
      size="icon"
      className={`rounded-full ${inWishlist
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-white text-black hover:bg-gray-950'
        } transition-all duration-300`}
      onClick={handleClick}
      disabled={isLoading}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`}
        fill={inWishlist ? 'currentColor' : 'none'}
      />
    </Button>
  );
};