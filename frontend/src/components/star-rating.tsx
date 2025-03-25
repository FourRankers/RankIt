'use client';

import { Star, StarHalf } from 'lucide-react';
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

  const handleClick = (starNumber: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starNumber);
    }
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const starNumber = i + 1;
        const displayRating = hoverRating || rating;
        const showHalfStar = readonly && 
          displayRating > (starNumber - 1) && 
          displayRating < starNumber;
        
        return (
          <div 
            key={i}
            className={cn(
              "relative",
              !readonly && "cursor-pointer hover:scale-110 transition-transform"
            )}
            onMouseEnter={() => !readonly && setHoverRating(starNumber)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
          >
            <div className="relative" style={{ width: `${size * 4}px`, height: `${size * 4}px` }}>
              {/* Empty Star */}
              <Star className={cn(
                `h-${size} w-${size} absolute`,
                "fill-muted text-muted-foreground",
                className
              )} />
              
              {/* Half Star */}
              {showHalfStar && (
                <div className="absolute overflow-hidden w-1/2">
                  <StarHalf className={cn(
                    `h-${size} w-${size}`,
                    "fill-primary text-primary",
                    className
                  )} />
                </div>
              )}

              {/* Full Star */}
              <div 
                className="absolute"
                style={{ opacity: displayRating >= starNumber ? 1 : 0 }}
              >
                <Star className={cn(
                  `h-${size} w-${size}`,
                  "fill-primary text-primary",
                  className
                )} />
              </div>
            </div>

            {/* Click Areas */}
            {!readonly && (
              <button
                className="absolute inset-0"
                onClick={() => handleClick(starNumber)}
                aria-label={`Rate ${starNumber} stars`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StarRating; 