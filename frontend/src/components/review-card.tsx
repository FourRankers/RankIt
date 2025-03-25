import { useState } from 'react'
import { Flag, ThumbsUp, ThumbsDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {StarRating} from '@/components/star-rating'
import { cn } from "@/lib/utils"

interface ReviewCardProps {
  author: string
  rating: number
  date: string
  content: string
  avatar?: string
  title?: string
  helpful?: number
}

export function ReviewCard({ 
  author, 
  rating, 
  date, 
  content,
  avatar = '',
  title = '',
  helpful = 0
}: ReviewCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [likeCount, setLikeCount] = useState(helpful)

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1)
      setIsLiked(false)
    } else {
      if (isDisliked) {
        setIsDisliked(false)
      }
      setLikeCount(prev => prev + 1)
      setIsLiked(true)
    }
  }

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false)
    } else {
      if (isLiked) {
        setLikeCount(prev => prev - 1)
        setIsLiked(false)
      }
      setIsDisliked(true)
    }
  }

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="sr-only">Open menu</span>
              <svg width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1.5 1.5C1.5 1.89782 1.65804 2.27936 1.93934 2.56066C2.22064 2.84196 2.60218 3 3 3C3.39782 3 3.77936 2.84196 4.06066 2.56066C4.34196 2.27936 4.5 1.89782 4.5 1.5C4.5 1.10218 4.34196 0.720644 4.06066 0.43934C3.77936 0.158035 3.39782 0 3 0C2.60218 0 2.22064 0.158035 1.93934 0.43934C1.65804 0.720644 1.5 1.10218 1.5 1.5ZM7.5 1.5C7.5 1.89782 7.65804 2.27936 7.93934 2.56066C8.22064 2.84196 8.60218 3 9 3C9.39782 3 9.77936 2.84196 10.0607 2.56066C10.342 2.27936 10.5 1.89782 10.5 1.5C10.5 1.10218 10.342 0.720644 10.0607 0.43934C9.77936 0.158035 9.39782 0 9 0C8.60218 0 8.22064 0.158035 7.93934 0.43934C7.65804 0.720644 7.5 1.10218 7.5 1.5ZM13.5 1.5C13.5 1.89782 13.658 2.27936 13.9393 2.56066C14.2206 2.84196 14.6022 3 15 3C15.3978 3 15.7794 2.84196 16.0607 2.56066C16.342 2.27936 16.5 1.89782 16.5 1.5C16.5 1.10218 16.342 0.720644 16.0607 0.43934C15.7794 0.158035 15.3978 0 15 0C14.6022 0 14.2206 0.158035 13.9393 0.43934C13.658 0.720644 13.5 1.10218 13.5 1.5Z"
                  fill="currentColor"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center">
              <Flag className="mr-2 h-4 w-4" />
              <span>Report review</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <div className="flex items-center gap-1 mb-1">
          <div className="flex items-center">
            <StarRating rating={rating} readonly={true}/>
          </div>
        </div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{content}</p>
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
            <span>Like ({likeCount})</span>
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

