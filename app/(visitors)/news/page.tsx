import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ChevronRight } from "lucide-react"
import Image from "next/image"

const latestNews = [
  {
    id: 1,
    title: "Annual Science Fair 2024 - Outstanding Student Innovations",
    excerpt: "Our students showcased remarkable scientific projects and innovations at this year's science fair...",
    image: "/placeholder.svg?height=200&width=300",
    author: "Dr. Emily Carter",
    date: "2024-01-15",
    category: "Events",
  },
  {
    id: 2,
    title: "New Computer Lab Inauguration with Latest Technology",
    excerpt:
      "State-of-the-art computer laboratory equipped with the latest hardware and software for enhanced learning...",
    image: "/placeholder.svg?height=200&width=300",
    author: "Prof. Michael Johnson",
    date: "2024-01-10",
    category: "Infrastructure",
  },
  {
    id: 3,
    title: "Outstanding Results in National Mathematics Olympiad",
    excerpt:
      "Our students achieved exceptional results in the National Mathematics Olympiad, bringing pride to our school...",
    image: "/placeholder.svg?height=200&width=300",
    author: "Ms. Sarah Williams",
    date: "2024-01-05",
    category: "Achievements",
  },
]

const allNews = [
  ...latestNews,
  {
    id: 4,
    title: "Inter-School Sports Championship Victory",
    excerpt:
      "Royal Academy emerges victorious in the annual inter-school sports championship with outstanding performances...",
    image: "/placeholder.svg?height=200&width=300",
    author: "Mr. David Brown",
    date: "2023-12-20",
    category: "Sports",
  },
  {
    id: 5,
    title: "Cultural Festival 2023 - A Grand Celebration",
    excerpt:
      "Students from all streams came together to celebrate diversity and culture in our annual cultural festival...",
    image: "/placeholder.svg?height=200&width=300",
    author: "Dr. Lisa Chen",
    date: "2023-12-15",
    category: "Events",
  },
  {
    id: 6,
    title: "New Library Wing Opens with 5000+ Books",
    excerpt: "Expansion of our library facility with modern reading spaces and an extensive collection of books...",
    image: "/placeholder.svg?height=200&width=300",
    author: "Ms. Sarah Williams",
    date: "2023-12-10",
    category: "Infrastructure",
  },
]

export default function NewsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Latest News Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest News</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stay updated with the latest happenings and achievements at Royal Academy
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {latestNews.map((news, index) => (
                <Card
                  key={news.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative h-48">
                    <Image src={news.image || "/placeholder.svg"} alt={news.title} fill className="object-cover" />
                    <Badge className="absolute top-4 left-4">{news.category}</Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">{news.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{news.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{news.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(news.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      Read More <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All News Section */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12 animate-fade-in">All News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allNews.map((news, index) => (
                <Card
                  key={news.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-48">
                    <Image src={news.image || "/placeholder.svg"} alt={news.title} fill className="object-cover" />
                    <Badge className="absolute top-4 left-4">{news.category}</Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 line-clamp-2">{news.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{news.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{news.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(news.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Read More <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button size="sm">1</Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
