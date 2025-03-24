"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { StarRating } from "./star-rating"

interface ItemCardProps {
  id: string
  title: string
  category: string
  rating: number
  reviewCount: number
  image: string
}

export const ItemCard = ({
  id,
  title,
  category,
  rating,
  reviewCount,
  image,
}: ItemCardProps) => {
  const router = useRouter()

  return (
    <div 
      onClick={() => router.push(`/items/${id}`)}
      className="group block rounded-lg border p-4 transition-colors hover:shadow-md cursor-pointer"
    >
      <div className="relative aspect-square mb-3 rounded-lg overflow-hidden">
        <Image
          src={image || "/default.jpg"}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">{category}</div>
        <div className="font-semibold line-clamp-2">{title}</div>
        <div className="flex items-center gap-2">
          <StarRating rating={rating} size={4} />
          <span className="text-sm text-muted-foreground">
            ({reviewCount})
          </span>
        </div>
      </div>
    </div>
  )
}

