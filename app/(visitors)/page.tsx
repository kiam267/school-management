import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/home/hero-section';
import { TestimonialSection } from '@/components/home/testimonial-section';
import { StatisticsSection } from '@/components/home/statistics-section';
import { TeacherSection } from '@/components/home/teacher-section';

export async function generateMetadata() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const settingsResponse = await fetch(
    `${baseUrl}/api/settings`
  );

  if (!settingsResponse.ok) {
    throw new Error('Failed to fetch data');
  }

  const settings = await settingsResponse.json();

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
