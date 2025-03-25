"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { StarRating } from "./star-rating"
import { Post } from "@/lib/type"
import { useState } from "react"
import { formatDate } from "@/lib/utils"

export const ItemCard = ({
  id,
  title,
  imageUrl,
  category,
  averageRating,
  timestamp
}: Partial<Post>) => {
  const router = useRouter()
  const [image, setImage] = useState<string>(imageUrl || '/default.jpg')

  const handleError = () => {
    setImage('/default.jpg')
  }

  const formattedDate = timestamp?._seconds 
    ? formatDate(new Date(timestamp._seconds * 1000))
    : '';

  return (
    <div 
      onClick={() => router.push(`/items/${id}`)}
      className="group block rounded-lg border p-4 transition-colors hover:shadow-md cursor-pointer"
    >
      <div className="relative aspect-square mb-3 rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={title || 'image'}
          onError={handleError}
          fill
          priority
          className="object-cover transition-transform group-hover:scale-105"
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground flex justify-between">
          <span>{category}</span>
          <span>{formattedDate}</span>
        </div>
        <div className="font-semibold line-clamp-2">{title}</div>
        <div className="flex items-center gap-2">
          <StarRating rating={averageRating || 0} size={4} readonly />
          <span className="text-base text-muted-foreground">
            {averageRating}
          </span>
        </div>
      </div>
    </div>
  )
}

