"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "./star-rating"

interface ReviewFormProps {
  itemId: string
  onCancel?: () => void
}

export const ReviewForm = ({ itemId, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ itemId, rating, content })
    onCancel?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <StarRating 
          rating={rating} 
          onRatingChange={setRating}
          size={6}
        />
        <span className="text-sm text-muted-foreground">
          {rating > 0 ? `${rating} Star` : 'Please select a rating'}
        </span>
      </div>

      <Textarea
        placeholder="Share your experience..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />

      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={!rating || !content.trim()}
        >
          Submit
        </Button>
      </div>
    </form>
  )
}

