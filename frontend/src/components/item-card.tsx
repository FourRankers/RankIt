import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ItemCardProps {
  id: string
  title: string
  category: string
  rating: number
  reviewCount: number
  image: string
}

export function ItemCard({ id, title, category, rating, reviewCount, image }: ItemCardProps) {
  return (
    <Link href={`/items/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="aspect-square relative">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          <Badge className="absolute top-2 right-2">{category}</Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-base line-clamp-1">{title}</h3>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center gap-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
        </CardFooter>
      </Card>
    </Link>
  )
}

