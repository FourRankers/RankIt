import type React from "react"
import Link from "next/link"
import type { LucideIcon } from 'lucide-react'
import { Book, Film, Gamepad2, Laptop, Plane, Utensils } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  name: string
  count: number
  icon: string
  className?: string
}

export function CategoryCard({ name, count, icon, className }: CategoryCardProps) {
  const IconComponent = getIconByName(icon)

  return (
    <Link href={`/categories/${name.toLowerCase()}`}>
      <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
        <CardContent className="p-4 flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-medium text-sm">{name}</h3>
            <p className="text-xs text-muted-foreground">{count} items</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function getIconByName(name: string): LucideIcon {
  switch (name.toLowerCase()) {
    case "laptop":
      return Laptop
    case "book":
      return Book
    case "film":
      return Film
    case "gamepad-2":
      return Gamepad2
    case "utensils":
      return Utensils
    case "plane":
      return Plane
    default:
      return Laptop
  }
}

