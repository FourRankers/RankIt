'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  className?: string;
  size?: number;
}

export const StarRating = ({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  className = "", 
  size = 5 
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const starNumber = i + 1;
        const isActive = (hoverRating || rating) >= starNumber;
        
        return (
          <button
            key={i}
            type="button"
            className={cn(
              "relative p-0.5 focus:outline-none",
              !readonly && "cursor-pointer hover:scale-110 transition-transform"
            )}
            onClick={() => !readonly && onRatingChange?.(starNumber)}
            onMouseEnter={() => !readonly && setHoverRating(starNumber)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            disabled={readonly}
          >
            <Star 
              className={cn(
                `h-${size} w-${size}`,
                isActive ? "fill-primary text-primary" : "fill-muted text-muted-foreground",
                className
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating; 