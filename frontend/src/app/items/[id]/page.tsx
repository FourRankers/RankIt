'use client';

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState } from 'react';

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ReviewCard } from "@/components/review-card"
import { ReviewForm } from "@/components/review-form"
import { StarRating } from "@/components/star-rating"

export default function ItemPage({ params }: { params: { id: string } }) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  // In a real app, you would fetch the item data based on the ID
  const item = {
    id: params.id,
    title: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
    category: "Electronics",
    description:
      "Industry-leading noise cancellation with Dual Noise Sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo. Up to 30-hour battery life with quick charging (10 min charge for 5 hours of playback). Touch Sensor controls to pause/play/skip tracks, control volume, activate your voice assistant, and answer phone calls. Speak-to-chat technology automatically reduces volume during conversations.",
    rating: 4.8,
    reviewCount: 1243,
    image: "",
   
  }

  return (
    <div className="container px-4 py-6 md:py-10">
      <div className="mb-6">
        <Link 
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative w-[320px] h-[320px] rounded-lg overflow-hidden border mx-auto">
            <Image 
              src={item.image || "/default.jpg"} 
              alt={item.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{item.category}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{item.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={item.rating} readonly={true} />
              <span className="font-medium">{item.rating.toFixed(1)}</span>
            </div>
          </div>
          <Separator />

          <div>
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>

        </div>
      </div>

      <Separator className="my-8" />

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <span className="text-sm text-muted-foreground">({item.reviewCount} reviews)</span>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button onClick={() => setShowReviewForm(true)}>
              Write a review
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <select className="text-sm border rounded p-1">
                <option>Most Recent</option>
                <option>Highest Rated</option>
                <option>Lowest Rated</option>
              </select>
            </div>
          </div>

          {showReviewForm && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <ReviewForm 
                itemId={item.id} 
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          <div className="space-y-4">
            <ReviewCard
              author="John Doe"
              avatar="/placeholder.svg?height=40&width=40"
              rating={5}
              date="March 15, 2025"
              title="Absolutely amazing sound quality!"
              content="I've been using these headphones for about a month now and I'm blown away by the sound quality and noise cancellation. Battery life is excellent too - I only need to charge them once a week with daily use."
              helpful={42}
            />

            <ReviewCard
              author="Jane Smith"
              avatar="/placeholder.svg?height=40&width=40"
              rating={4}
              date="March 10, 2025"
              title="Great headphones, minor comfort issues"
              content="The sound quality and noise cancellation are top-notch. My only complaint is that they get a bit uncomfortable after wearing them for 3+ hours. Otherwise, they're fantastic and the battery life is impressive."
              helpful={28}
            />

            <ReviewCard
              author="Michael Johnson"
              avatar="/placeholder.svg?height=40&width=40"
              rating={5}
              date="March 5, 2025"
              title="Best headphones I've ever owned"
              content="These headphones have changed my work-from-home life. The noise cancellation blocks out all distractions, and the sound quality is incredible for both music and calls. The speak-to-chat feature is surprisingly useful too!"
              helpful={56}
            />

            <div className="flex justify-center">
              <Button variant="outline">Load more reviews</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

