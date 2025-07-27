import { db } from './db';
import { aboutPage, achievements } from './schema/schema';

const initialAboutSections = [
  {
    section: 'hero',
    title: 'About Our School',
    content: 'Excellence in Education Since 1985',
    image: '/placeholder.svg?height=400&width=1200',
    order: 1,
  },
  {
    section: 'vision',
    title: 'Our Vision',
    content: 'To be a leading educational institution that nurtures innovative thinkers, compassionate leaders, and responsible global citizens who contribute meaningfully to society and drive positive change in the world.',
    image: null,
    order: 2,
  },
  {
    section: 'mission',
    title: 'Our Mission',
    content: 'We provide a comprehensive, student-centered education that combines academic excellence with character development, critical thinking, and practical skills preparation for higher education and life success.',
    image: null,
    order: 3,
  },
  {
    section: 'overview',
    title: 'School Overview',
    content: `Royal Academy has been a cornerstone of educational excellence for nearly four decades. Founded in 1985, we have consistently evolved to meet the changing needs of our students and the demands of a rapidly advancing world.

Our comprehensive curriculum spans Science, Commerce, and General streams, ensuring that every student finds their path to success. With state-of-the-art facilities, experienced faculty, and a commitment to holistic development, we prepare students not just for examinations, but for life.

We believe in fostering an environment where curiosity thrives, creativity flourishes, and character is built. Our students graduate as confident, capable individuals ready to make their mark in higher education and beyond.`,
    image: null,
    order: 4,
  },
  {
    section: 'features',
    title: 'Key Features',
    content: null,
    image: null,
    order: 5,
  },
  {
    section: 'timeline',
    title: 'Our Journey',
    content: null,
    image: null,
    order: 6,
  },
];

const initialAchievements = [
  {
    year: '1985',
    title: 'School Founded',
    description: 'Established with a vision for excellence',
    order: 1,
  },
  {
    year: '1995',
    title: 'First Computer Lab',
    description: 'Introduced technology in education',
    order: 2,
  },
  {
    year: '2005',
    title: 'Science Excellence Award',
    description: 'Recognized for outstanding science education',
    order: 3,
  },
  {
    year: '2015',
    title: 'Digital Transformation',
    description: 'Fully integrated digital learning',
    order: 4,
  },
  {
    year: '2020',
    title: 'Online Learning Pioneer',
    description: 'Successfully adapted to remote learning',
    order: 5,
  },
  {
    year: '2024',
    title: 'AI Integration',
    description: 'Leading in AI-assisted education',
    order: 6,
  },
];

export async function seedAboutPage() {
  try {
    console.log('Seeding about page data...');
    
    // Seed about page sections
    for (const section of initialAboutSections) {
      const existing = await db
        .select()
        .from(aboutPage)
        .where(eq(aboutPage.section, section.section))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(aboutPage).values({
          ...section,
          updatedAt: new Date().toISOString(),
        });
        console.log(`Inserted about section: ${section.section}`);
      } else {
        console.log(`About section already exists: ${section.section}`);
      }
    }

    // Seed achievements
    for (const achievement of initialAchievements) {
      const existing = await db
        .select()
        .from(achievements)
        .where(and(
          eq(achievements.year, achievement.year),
          eq(achievements.title, achievement.title)
        ))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(achievements).values({
          ...achievement,
          updatedAt: new Date().toISOString(),
        });
        console.log(`Inserted achievement: ${achievement.title}`);
      } else {
        console.log(`Achievement already exists: ${achievement.title}`);
      }
    }
    
    console.log('About page seeding completed!');
  } catch (error) {
    console.error('Error seeding about page data:', error);
  }
}

// Import the eq function
import { eq, and } from 'drizzle-orm';

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedAboutPage()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
} 