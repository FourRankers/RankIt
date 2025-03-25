"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "./star-rating"
import { useAuth } from "@/contexts/auth-context"

interface ReviewFormProps {
  itemId: string
  onCancel?: () => void
  onSuccess?: () => void
}

export const ReviewForm = ({ itemId, onCancel, onSuccess }: ReviewFormProps) => {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return alert('Please log in first')
    if (!rating || !content.trim()) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('http://localhost:8080/api/posts/add-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.uid}`,
          'userId': user.uid
        },
        body: JSON.stringify({
          postId: itemId,
          content: content.trim(),
          rating,
          authorId: user.uid,
          authorName: user.email || 'anonymous'
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      onCancel?.()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Submit Failed:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit comment')
    } finally {
      setIsSubmitting(false)
    }
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
          disabled={!rating || !content.trim() || isSubmitting}
          aria-label={isSubmitting ? 'Submitting...' : 'Submit'}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  )
}

