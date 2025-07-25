'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultHeroSlides = [
  {
    image: '/placeholder.svg?height=800&width=1200',
    title: 'Excellence in Education',
    subtitle:
      'Empowering minds, shaping futures since 1985',
  },
  {
    image: '/placeholder.svg?height=800&width=1200',
    title: 'Innovative Learning',
    subtitle:
      "Modern teaching methods for tomorrow's leaders",
  },
  {
    image: '/placeholder.svg?height=800&width=1200',
    title: 'Knowledge & Growth',
    subtitle:
      'Building strong foundations for lifelong success',
  },
];

export function HeroSection() {
  const [slides, setSlides] = useState(defaultHeroSlides);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Fetch slides from /api/hero
    fetch('/api/hero')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Filter out inactive slides
          const activeSlides = data.filter(
            slide => slide.active !== false
          );
          if (activeSlides.length > 0) {
            setSlides(activeSlides);
          } else {
            setSlides(defaultHeroSlides);
          }
        } else {
          // Fallback to default slides if API returns empty
          setSlides(defaultHeroSlides);
        }
      })
      .catch(() => {
        // fallback to defaultHeroSlides
        setSlides(defaultHeroSlides);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      prev => (prev - 1 + slides.length) % slides.length
    );
  };

  return (
    <section className="relative h-screen overflow-hidden">
      <div
        className="hero-slider absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${slides[currentSlide].image})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
        <div className="max-w-4xl px-4 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
            {slides[currentSlide].title}
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            {slides[currentSlide].subtitle}
          </p>
          <Link href="/about" passHref legacyBehavior>
            <Button
              size="lg"
              className="animate-slide-up"
              style={{ animationDelay: '0.4s' }}
            >
              Learn More About Us
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide
                ? 'bg-white'
                : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
