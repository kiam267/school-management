"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

const testimonials = {
  science: [
    {
      name: "Sarah Johnson",
      class: "Grade 12 - Science",
      quote: "The science program here opened my eyes to the wonders of research and discovery.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Michael Chen",
      class: "Grade 11 - Science",
      quote: "Amazing lab facilities and supportive teachers made learning chemistry so engaging.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Emma Davis",
      class: "Grade 10 - Science",
      quote: "The hands-on experiments and projects helped me understand complex concepts easily.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ],
  general: [
    {
      name: "Alex Thompson",
      class: "Grade 12 - General",
      quote: "The well-rounded education prepared me for university and beyond.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Lisa Wang",
      class: "Grade 11 - General",
      quote: "Great balance of academics and extracurricular activities.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "David Miller",
      class: "Grade 10 - General",
      quote: "Teachers here really care about each student's individual growth.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ],
  commerce: [
    {
      name: "Rachel Green",
      class: "Grade 12 - Commerce",
      quote: "The business studies program gave me real-world skills and knowledge.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "James Wilson",
      class: "Grade 11 - Commerce",
      quote: "Excellent preparation for my future career in finance and business.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Sophie Brown",
      class: "Grade 10 - Commerce",
      quote: "The practical approach to learning economics made it so much more interesting.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ],
}

export function TestimonialSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from our students about their experiences across different academic streams
          </p>
        </div>

        <Tabs defaultValue="science" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="science">Science</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="commerce">Commerce</TabsTrigger>
          </TabsList>

          {Object.entries(testimonials).map(([stream, testimonialList]) => (
            <TabsContent key={stream} value={stream} className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonialList.map((testimonial, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Quote className="h-8 w-8 text-accent mb-4" />
                      <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                          <AvatarFallback>
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.class}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
