"use client"

import { useEffect, useRef, useState } from "react"
import { Users, GraduationCap, Building, BookOpen, Monitor } from "lucide-react"

const statistics = [
  { icon: Users, label: "Total Students", value: 1250, suffix: "+" },
  { icon: GraduationCap, label: "Total Teachers", value: 85, suffix: "+" },
  { icon: Building, label: "Classrooms", value: 45, suffix: "" },
  { icon: BookOpen, label: "Library Books", value: 15000, suffix: "+" },
  { icon: Monitor, label: "Computers", value: 120, suffix: "+" },
]

function CountUpAnimation({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function StatisticsSection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our School in Numbers</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Discover the scale and impact of our educational community
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {statistics.map((stat, index) => (
            <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-accent rounded-full">
                  <stat.icon className="h-8 w-8 text-accent-foreground" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <CountUpAnimation end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm md:text-base opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
