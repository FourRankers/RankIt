'use client';

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { useEffect, useState, use } from 'react';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ReviewCard } from "@/components/review-card"
import { ReviewForm } from "@/components/review-form"
import { StarRating } from "@/components/star-rating"
import { Post } from "@/lib/type";

export default function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [item, setItem] = useState<Post|null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/get-post/${resolvedParams.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch post');
      }

      const postData = await response.json();
      setItem({
        id: postData.id,
        title: postData.title,
        category: postData.category,
        description: postData.description,
        authorRating: postData.authorRating || 0,
        averageRating:postData.averageRating || 0,
        reviewCount: postData.comments?.length || 0,
        imageUrl: postData.imageUrl || "",
        authorId: postData.authorId || '',
        authorName: postData.authorName || 'Anonymous',
        comments: postData.comments || [],
        timestamp: postData.timestamp || new Date().toISOString()
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load post';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-6 text-center text-destructive">
        <AlertCircle className="mx-auto h-8 w-8 mb-4" />
        <p>{error}</p>
        <Button className="mt-4" onClick={fetchPost}>
          Retry
        </Button>
      </div>
    );
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
              src={item?.imageUrl || "/default.jpg"} 
              alt={item?.title || 'image'} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{item?.category}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{item?.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={item?.averageRating || 0} readonly={true} />
              <span className="font-medium">{item?.averageRating.toFixed(1)}</span>
            </div>
          </div>
          <Separator />

          <div>
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-sm text-muted-foreground">{item?.description}</p>
          </div>

        </div>
      </div>

      <Separator className="my-8" />

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <span className="text-sm text-muted-foreground">({item?.reviewCount} reviews)</span>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button onClick={() => setShowReviewForm(true)}>
              Write a review
            </Button>
          </div>

          {showReviewForm && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <ReviewForm 
                itemId={item?.id || '0'} 
                onCancel={() => setShowReviewForm(false)}
                onSuccess={fetchPost}
              />
            </div>
          )}

          <div className="space-y-4">
            {item?.comments.map(comment => (
              <ReviewCard
                key={comment.id}
                postId={item.id}
                commentId={comment.id}
                author={comment.authorName}
                rating={comment.rating}
                date={new Date(comment.timestamp._seconds * 1000).toLocaleDateString()}
                content={comment.content}
                upvotes={comment.upvotes || 0}
              />
            ))}

            {item?.comments.length ? (
              <div className="flex justify-center">
                <Button variant="outline">Load more reviews</Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                No reviews yet. Be the first to write one!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

