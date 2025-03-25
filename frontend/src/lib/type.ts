export interface Post {
  id: string
  title: string
  description: string
  imageUrl: string
  authorId: string
  category: string
  authorName: string
  authorRating: number
  comments: unknown[]
  reviewCount: number
  timestamp: {
    _seconds: number
    _nanoseconds: number
  }
}
