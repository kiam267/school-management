
import { HeroSection } from '@/components/home/hero-section';
import { TestimonialSection } from '@/components/home/testimonial-section';
import { StatisticsSection } from '@/components/home/statistics-section';
import { TeacherSection } from '@/components/home/teacher-section';
import { getSettings } from '@/lib/get-settings';

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings?.metaTitle,
    description: settings?.metaDescription,
    keywords: settings?.metaKeywords,
    icons: {
      icon: settings?.favicon,
    },
  };
}

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
