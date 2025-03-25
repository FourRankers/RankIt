'use client';

import { useState } from 'react';
import Link from "next/link"
import { Search, Plus } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CategoryCard } from "@/components/category-card"
import { ItemCard } from "@/components/item-card"
import { AddItemDialog } from '@/components/add-item-dialog'

export default function HomePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("All");

  const items = [
    {
      id: "1",
      title: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
      category: "Electronics",
      rating: 4.8,
      reviewCount: 1243,
      image: "/default.jpg"
    },
  ]

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
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="hidden md:inline-flex">
                Log in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Sign up</Button>
            </Link>
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
                count={7515}
                icon="layout-grid"
                isSelected={selectedCategory === "All"}
                onClick={() => setSelectedCategory("All")}
              />
              <CategoryCard
                name="Electronics" 
                count={1243} 
                icon="laptop"
                isSelected={selectedCategory === "Electronics"}
                onClick={() => setSelectedCategory("Electronics")}
              />
              <CategoryCard 
                name="Books" 
                count={876} 
                icon="book"
                isSelected={selectedCategory === "Books"}
                onClick={() => setSelectedCategory("Books")}
              />
              <CategoryCard 
                name="Movies" 
                count={1532} 
                icon="film"
                isSelected={selectedCategory === "Movies"}
                onClick={() => setSelectedCategory("Movies")}
              />
              <CategoryCard 
                name="Restaurants" 
                count={2156} 
                icon="utensils"
                isSelected={selectedCategory === "Restaurants"}
                onClick={() => setSelectedCategory("Restaurants")}
              />
              <CategoryCard 
                name="Other" 
                count={765} 
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

      <AddItemDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}

