export interface Post {
  id: string
  title: string
  description: string
  imageUrl: string
  authorId: string
  category: string
  authorName: string
  authorRating: number
  averageRating:number
  comments: {
    authorId: string
    authorName: string
    content: string
    id: string
    rating: number
    timestamp: {
      _seconds: number
      _nanoseconds: number
    }
    upvotes: number
  }[]
  reviewCount: number
  timestamp: {
    _seconds: number
    _nanoseconds: number
  }
}
