"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const teachers = [
  {
    name: "Dr. Emily Carter",
    designation: "Head Teacher",
    subject: "Mathematics & Physics",
    image: "/placeholder.svg?height=200&width=200",
    experience: "15 years",
  },
  {
    name: "Prof. Michael Johnson",
    designation: "Senior Teacher",
    subject: "Chemistry & Biology",
    image: "/placeholder.svg?height=200&width=200",
    experience: "12 years",
  },
  {
    name: "Ms. Sarah Williams",
    designation: "Staff Teacher",
    subject: "English Literature",
    image: "/placeholder.svg?height=200&width=200",
    experience: "8 years",
  },
  {
    name: "Mr. David Brown",
    designation: "Staff Teacher",
    subject: "History & Geography",
    image: "/placeholder.svg?height=200&width=200",
    experience: "10 years",
  },
  {
    name: "Dr. Lisa Chen",
    designation: "Assistant Teacher",
    subject: "Computer Science",
    image: "/placeholder.svg?height=200&width=200",
    experience: "6 years",
  },
]

export function TeacherSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 3

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + itemsPerPage >= teachers.length ? 0 : prev + itemsPerPage))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - itemsPerPage < 0 ? Math.max(0, teachers.length - itemsPerPage) : prev - itemsPerPage,
    )
  }

  const visibleTeachers = teachers.slice(currentIndex, currentIndex + itemsPerPage)

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Teachers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our dedicated faculty members are committed to providing excellent education
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {visibleTeachers.map((teacher, index) => (
              <Card key={currentIndex + index} className="hover:shadow-lg transition-all duration-300 animate-fade-in">
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={teacher.image || "/placeholder.svg"} alt={teacher.name} />
                    <AvatarFallback>
                      {teacher.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-2">{teacher.name}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {teacher.designation}
                  </Badge>
                  <p className="text-muted-foreground mb-2">{teacher.subject}</p>
                  <p className="text-sm text-muted-foreground">{teacher.experience} experience</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <Button variant="outline" size="icon" onClick={prevSlide} disabled={currentIndex === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={currentIndex + itemsPerPage >= teachers.length}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <Button asChild>
              <Link href="/teachers">See All Teachers</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
