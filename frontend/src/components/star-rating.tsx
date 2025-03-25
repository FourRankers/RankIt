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

  const handleClick = (starNumber: number, isHalf: boolean) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starNumber - (isHalf ? 0.5 : 0));
    }
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const starNumber = i + 1;
        const fullStarThreshold = starNumber - 0.5;
        const displayRating = hoverRating || rating;
        
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
              <div 
                className="absolute overflow-hidden"
                style={{ width: displayRating >= fullStarThreshold ? '50%' : '0%' }}
              >
                <StarHalf className={cn(
                  `h-${size} w-${size}`,
                  "fill-primary text-primary",
                  className
                )} />
              </div>

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
              <>
                <button
                  className="absolute left-0 inset-y-0 w-1/2"
                  onClick={() => handleClick(starNumber, true)}
                  aria-label={`Rate ${starNumber - 0.5} stars`}
                />
                <button
                  className="absolute right-0 inset-y-0 w-1/2"
                  onClick={() => handleClick(starNumber, false)}
                  aria-label={`Rate ${starNumber} stars`}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StarRating; 