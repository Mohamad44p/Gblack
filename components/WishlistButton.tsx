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
        await addToWishlist(product);
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
      className={`rounded-full cursor-pointer ${inWishlist ? 'bg-red-500 text-white cursor-pointer' : 'bg-white cursor-pointer text-black'} hover:bg-white/80 cursor-pointer transition-all duration-300`}
      onClick={handleClick}
      disabled={isLoading}
    >
      <Heart className="w-4 h-4 cursor-pointer" fill={inWishlist ? 'currentColor' : 'none'} />
    </Button>
  );
};