import { HeroSection } from '@/components/home/hero-section';
import { TestimonialSection } from '@/components/home/testimonial-section';
import { StatisticsSection } from '@/components/home/statistics-section';
import { TeacherSection } from '@/components/home/teacher-section';
import { getSettings } from '@/lib/get-settings';

// 1. Move settings to a shared variable at the top level
let sharedSettings: any = null;

const setSettings = (newSettings: any) => {
  sharedSettings = newSettings;
};

const getMetadata = () => ({
  metaTitle: sharedSettings?.metaTitle || 'Default Title',
  metaDescription:
    sharedSettings?.metaDescription ||
    'Default Description',
  metaKeywords:
    sharedSettings?.metaKeywords || 'default, keywords',
  favicon: sharedSettings?.favicon || '/favicon.ico',
});


// export async function generateMetadata() {
//   if (!sharedSettings) {
//     sharedSettings = await getSettings();
//   }

//   const settings = getMetadata();
//   return {
//     title: settings.metaTitle,
//     description: settings.metaDescription,
//     keywords: settings.metaKeywords,
//     icons: {
//       icon: settings.favicon,
//     },
//   };
// }

// 3. Also use in the page component
export default async function HomePage() {
  // const settings = await getSettings();
  // setSettings(settings);

  return (
    <main className="container mx-auto">
      <HeroSection />
      <TestimonialSection />
      <StatisticsSection />
      <TeacherSection />
    </main>
  );
}
