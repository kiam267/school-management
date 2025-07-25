import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/home/hero-section';
import { TestimonialSection } from '@/components/home/testimonial-section';
import { StatisticsSection } from '@/components/home/statistics-section';
import { TeacherSection } from '@/components/home/teacher-section';

export default function HomePage() {
  return (
    <main className="container mx-auto">
      <HeroSection />
      <TestimonialSection />
      <StatisticsSection />
      <TeacherSection />
    </main>
  );
}
