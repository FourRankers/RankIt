import type React from "react"
import type { LucideIcon } from 'lucide-react'
import { 
  LayoutGrid, 
  GraduationCap, 
  Utensils, 
  Building2, 
  MoreHorizontal, 
  Toilet
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  name: string
  icon: string
  className?: string
  isSelected?: boolean
  onClick?: () => void
}

export function CategoryCard({ 
  name, 
  icon, 
  className,
  isSelected = false,
  onClick 
}: CategoryCardProps) {
  const IconComponent = getIconByName(icon)

  return (
    <Card 
      onClick={onClick}
      className={cn(
        "overflow-hidden hover:cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary bg-primary/5",
        className
      )}
    >
      <CardContent className="p-4 flex flex-col items-center text-center gap-2">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
          isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
        )}>
          <IconComponent className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-medium text-sm">{name}</h3>
        </div>
      </CardContent>
    </Card>
  )
}

function getIconByName(name: string): LucideIcon {
  switch (name.toLowerCase()) {
    case "layout-grid":
      return LayoutGrid
    case "course":
      return GraduationCap
    case "restaurant":
      return Utensils
    case "building":
      return Building2
    case "toilet":
      return Toilet
    case "other":
      return MoreHorizontal
    default:
      return LayoutGrid
  }
}

