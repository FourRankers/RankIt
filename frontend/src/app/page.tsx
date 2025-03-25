'use client';

import { useEffect, useState } from 'react';
import Link from "next/link"
import { Search, Plus } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CategoryCard } from "@/components/category-card"
import { ItemCard } from "@/components/item-card"
import { AddItemDialog } from '@/components/add-item-dialog'
import { useAuth } from '@/contexts/auth-context'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { Post } from '@/lib/type';



export default function HomePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("All");
  const { user, logout } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Post[]>([]);

  const fetchPosts = async() => {
    const url = new URL('http://localhost:8080/api/posts/get-posts');
    url.searchParams.append('limit', '10');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    setItems(data)
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create post');
    }
  }

  useEffect(()=>{
    fetchPosts()
  },[])

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center" aria-label="RankIt Home">
            <Image 
              src="/logo.png" 
              alt="RankIt Logo" 
              width={330}
              height={180}
              className="h-15 w-auto"
            />
          </Link>
          <div className="relative w-full max-w-sm mx-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search items..." className="w-full pl-8" />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/search">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="hidden md:inline-flex">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-6 md:py-10 max-w-7xl mx-auto px-4">
          <div className="grid gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
              <p className="text-gray-500">
                Real Opinions, Real UNSW Experience, Real Rankings
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <CategoryCard 
                name="All" 
                icon="layout-grid"
                isSelected={selectedCategory === "All"}
                onClick={() => setSelectedCategory("All")}
              />
              <CategoryCard 
                name="Course" 
                icon="course"
                isSelected={selectedCategory === "Course"}
                onClick={() => setSelectedCategory("Course")}
              />
              <CategoryCard 
                name="Restaurant" 
                icon="restaurant"
                isSelected={selectedCategory === "Restaurant"}
                onClick={() => setSelectedCategory("Restaurant")}
              />
              <CategoryCard 
                name="Building" 
                icon="building"
                isSelected={selectedCategory === "Building"}
                onClick={() => setSelectedCategory("Building")}
              />
              <CategoryCard 
                name="Toilet" 
                icon="toilet"
                isSelected={selectedCategory === "Toilet"}
                onClick={() => setSelectedCategory("Toilet")}
              />
              <CategoryCard 
                name="Other" 
                icon="other"
                isSelected={selectedCategory === "Other"}
                onClick={() => setSelectedCategory("Other")}
              />
            </div>
          </div>
        </section>

        <section className="py-6 max-w-7xl mx-auto px-4">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Popular Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map(item => (
                <div key={item.id}>
                  <ItemCard {...item} />
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">Load more</Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:h-16">
          <p className="text-sm text-muted-foreground">© 2025 RankIt. All rights reserved.</p>
        </div>
      </footer>

      <Button
        onClick={() => setDialogOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
      >
        <Plus className="!h-6 !w-6" />
        <span className="sr-only">Add Item</span>
      </Button>

      <AddItemDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSuccess={fetchPosts}
      />
    </div>
  )
}

