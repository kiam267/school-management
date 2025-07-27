import { db } from './db';
import { settings } from './schema/schema';

const initialSettings = [
  // Branding
  { key: 'schoolName', value: 'Ummez Academy', category: 'branding' },
  { key: 'logo', value: '/ummez.png', category: 'branding' },
  { key: 'favicon', value: '/ummez.png', category: 'branding' },
  { key: 'tagline', value: 'Excellence in Education Since 1985', category: 'branding' },

  // SEO & Metadata
  { key: 'metaTitle', value: 'Ummez Academy - School Management System', category: 'seo' },
  { key: 'metaDescription', value: 'Modern school management system with admin panel', category: 'seo' },
  { key: 'metaKeywords', value: 'school, education, academy, learning, students, teachers', category: 'seo' },

  // Contact Information
  { key: 'address', value: '123 Education Street, Learning City, LC 12345', category: 'contact' },
  { key: 'phone', value: '+1 (555) 123-4567', category: 'contact' },
  { key: 'email', value: 'info@royalacademy.edu', category: 'contact' },
  { key: 'website', value: 'https://royalacademy.edu', category: 'contact' },

  // Social Media
  { key: 'facebook', value: 'https://facebook.com/royalacademy', category: 'social' },
  { key: 'twitter', value: 'https://twitter.com/royalacademy', category: 'social' },
  { key: 'instagram', value: 'https://instagram.com/royalacademy', category: 'social' },
  { key: 'linkedin', value: 'https://linkedin.com/company/royalacademy', category: 'social' },
  { key: 'youtube', value: 'https://youtube.com/@royalacademy', category: 'social' },

  // School Information
  { key: 'establishedYear', value: '1985', category: 'school' },
  { key: 'principalName', value: 'Dr. Sarah Johnson', category: 'school' },
  { key: 'totalStudents', value: '1250+', category: 'school' },
  { key: 'totalTeachers', value: '85+', category: 'school' },
  { key: 'footerText', value: 'Empowering minds, shaping futures. Excellence in education since 1985.', category: 'school' },
  { key: 'copyrightText', value: '© 2024 Royal Academy. All rights reserved.', category: 'school' },

  // System Settings
  { key: 'timezone', value: 'America/New_York', category: 'system' },
  { key: 'dateFormat', value: 'MM/DD/YYYY', category: 'system' },
  { key: 'currency', value: 'USD', category: 'system' },
  { key: 'language', value: 'English', category: 'system' },
  { key: 'primaryColor', value: '#1E3A8A', category: 'system' },
  { key: 'accentColor', value: '#F59E0B', category: 'system' },
  { key: 'enableDarkMode', value: 'true', category: 'system' },
  { key: 'enableAnimations', value: 'true', category: 'system' },
];

export async function seedSettings() {
  try {
    console.log('Seeding settings...');
    
    for (const setting of initialSettings) {
      // Check if setting already exists
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, setting.key))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(settings).values({
          ...setting,
          updatedAt: new Date().toISOString(),
        });
        console.log(`Inserted setting: ${setting.key}`);
      } else {
        console.log(`Setting already exists: ${setting.key}`);
      }
    }
    
    console.log('Settings seeding completed!');
  } catch (error) {
    console.error('Error seeding settings:', error);
  }
}

// Import the eq function
import { eq } from 'drizzle-orm';

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedSettings()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
} 