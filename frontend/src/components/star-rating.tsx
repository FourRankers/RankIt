'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}

const StarRating = ({ rating, onRatingChange, readonly = false }: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readonly ? 'button' : 'submit'}
          className={cn(
            'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            readonly ? 'cursor-default' : 'cursor-pointer'
          )}
          onClick={() => !readonly && onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          disabled={readonly}
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={cn(
              'h-5 w-5 transition-colors',
              (hoverRating || rating) >= star
                ? 'fill-primary text-primary'
                : 'fill-none text-muted-foreground'
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating; 