import { useEffect, useState } from 'react'
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { StarRating } from '@/components/star-rating'
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

interface ReviewCardProps {
  author: string
  rating: number
  date: string
  content: string
  avatar?: string
  upvotes?: number
  postId: string
  commentId: string
}

export function ReviewCard({ 
  author, 
  rating, 
  date, 
  content,
  avatar = '',
  upvotes = 0,
  postId,
  commentId
}: ReviewCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [likeCount, setLikeCount] = useState(upvotes)
  const { user } = useAuth()

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1)
      setIsLiked(false)
    } else {
      setIsDisliked(false)
      setLikeCount(upvotes)
      setLikeCount(prev => prev + 1)
      setIsLiked(true)
    }
  }

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false)
      setLikeCount(prev => prev + 1)
    } else {
        setLikeCount(upvotes)
        setLikeCount(prev => prev - 1)
        setIsLiked(false)
        setIsDisliked(true)
    }
  }


  const updateVote = async (voteValue:number) => {
    try {
    const response = await fetch(
      `http://localhost:8080/api/posts/${postId}/comments/${commentId}/vote`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid,
          vote: voteValue
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Vote failed')
    }

    const result = await response.json()
    setLikeCount(result.currentVotes)

  } catch (error) {
    console.error('Voting error:', error)
    toast.error(error instanceof Error ? error.message : 'Vote failed')
  }
  }

  useEffect(()=>{
    console.log(likeCount);
    updateVote(likeCount)
  },[likeCount])

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar} alt={author} />
            <AvatarFallback>{author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{author}</div>
            <div className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1 mb-1">
          <div className="flex items-center">
            <StarRating rating={rating} readonly={true}/>
          </div>
        </div>
        <p className="text-base text-muted-foreground mt-1">{content}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "text-xs flex items-center",
              isLiked && "text-primary"
            )}
            onClick={handleLike}
          >
            <ThumbsUp className="h-3 w-3" />
            <span>Votes({likeCount})</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "text-xs",
              isDisliked && "text-primary"
            )}
            onClick={handleDislike}
          >
            <ThumbsDown className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

