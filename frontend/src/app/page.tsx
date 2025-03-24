import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryCard } from "@/components/category-card"
import { ItemCard } from "@/components/item-card"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
          <Link href="/" className="font-bold text-xl font-orbitron">
            RankIt
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
              <h1 className="text-3xl font-bold tracking-tight">Discover & Review</h1>
              <p className="text-muted-foreground">
                Find, rate, and review your favorite items across various categories
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <CategoryCard name="Electronics" count={1243} icon="laptop" />
              <CategoryCard name="Books" count={876} icon="book" />
              <CategoryCard name="Movies" count={1532} icon="film" />
              <CategoryCard name="Games" count={943} icon="gamepad-2" />
              <CategoryCard name="Restaurants" count={2156} icon="utensils" />
              <CategoryCard name="Travel" count={765} icon="plane" />
            </div>
          </div>
        </section>

        <section className="py-6 max-w-7xl mx-auto px-4">
          <Tabs defaultValue="trending" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Explore Items</h2>
              <TabsList>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="trending" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <ItemCard
                  id="1"
                  title="Sony WH-1000XM4 Headphones"
                  category="Electronics"
                  rating={4.8}
                  reviewCount={1243}
                  image="/placeholder.svg?height=300&width=300"
                />
                <ItemCard
                  id="2"
                  title="The Midnight Library"
                  category="Books"
                  rating={4.5}
                  reviewCount={876}
                  image="/placeholder.svg?height=300&width=300"
                />
                <ItemCard
                  id="3"
                  title="Dune (2021)"
                  category="Movies"
                  rating={4.7}
                  reviewCount={1532}
                  image="/placeholder.svg?height=300&width=300"
                />
                <ItemCard
                  id="4"
                  title="Elden Ring"
                  category="Games"
                  rating={4.9}
                  reviewCount={943}
                  image="/placeholder.svg?height=300&width=300"
                />
                <ItemCard
                  id="5"
                  title="Nobu Restaurant"
                  category="Restaurants"
                  rating={4.6}
                  reviewCount={756}
                  image="/placeholder.svg?height=300&width=300"
                />
                <ItemCard
                  id="6"
                  title="Bali Retreat Resort"
                  category="Travel"
                  rating={4.8}
                  reviewCount={543}
                  image="/placeholder.svg?height=300&width=300"
                />
                <ItemCard
                  id="7"
                  title="MacBook Pro M2"
                  category="Electronics"
                  rating={4.7}
                  reviewCount={987}
                  image="/placeholder.svg?height=300&width=300"
                />
                <ItemCard
                  id="8"
                  title="Project Hail Mary"
                  category="Books"
                  rating={4.9}
                  reviewCount={654}
                  image="/placeholder.svg?height=300&width=300"
                />
              </div>
              <div className="flex justify-center">
                <Button variant="outline">Load more</Button>
              </div>
            </TabsContent>
            <TabsContent value="recent" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <ItemCard
                  id="9"
                  title="iPhone 15 Pro"
                  category="Electronics"
                  rating={4.6}
                  reviewCount={432}
                  image="/placeholder.svg?height=300&width=300"
                />
                <ItemCard
                  id="10"
                  title="Fourth Wing"
                  category="Books"
                  rating={4.3}
                  reviewCount={321}
                  image="/placeholder.svg?height=300&width=300"
                />
                <ItemCard
                  id="11"
                  title="Oppenheimer"
                  category="Movies"
                  rating={4.8}
                  reviewCount={876}
                  image="/placeholder.svg?height=300&width=300"
                />
                <ItemCard
                  id="12"
                  title="Baldur's Gate 3"
                  category="Games"
                  rating={4.9}
                  reviewCount={765}
                  image="/placeholder.svg?height=300&width=300"
                />
              </div>
              <div className="flex justify-center">
                <Button variant="outline">Load more</Button>
              </div>
            </TabsContent>
            <TabsContent value="top-rated" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <ItemCard
                  id="13"
                  title="Bose QuietComfort Earbuds"
                  category="Electronics"
                  rating={5.0}
                  reviewCount={543}
                  image="/placeholder.svg?height=300&width=300"
                />
                <ItemCard
                  id="14"
                  title="A Court of Thorns and Roses"
                  category="Books"
                  rating={4.9}
                  reviewCount={987}
                  image="/placeholder.svg?height=300&width=300"
                />
                <ItemCard
                  id="15"
                  title="Everything Everywhere All at Once"
                  category="Movies"
                  rating={4.9}
                  reviewCount={1243}
                  image="/placeholder.svg?height=300&width=300"
                />
                <ItemCard
                  id="16"
                  title="The Legend of Zelda: Tears of the Kingdom"
                  category="Games"
                  rating={5.0}
                  reviewCount={1532}
                  image="/placeholder.svg?height=300&width=300"
                />
              </div>
              <div className="flex justify-center">
                <Button variant="outline">Load more</Button>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:h-16">
          <p className="text-sm text-muted-foreground">© 2025 ReviewHub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:underline">
              About
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

