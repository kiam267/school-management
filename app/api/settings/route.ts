import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { settings } from '@/db/schema/schema';
import { eq } from 'drizzle-orm';

// GET all settings
export async function GET() {
  try {
    const allSettings = await db.select().from(settings);
    
    // Convert array to object format for easier frontend consumption
    const settingsObject = allSettings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST to update settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings: settingsData } = body;

    if (!settingsData || typeof settingsData !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    const currentTime = new Date().toISOString();
    const updates = [];

    for (const [key, value] of Object.entries(settingsData)) {
      const stringValue = typeof value === 'boolean' ? value.toString() : String(value);
      
      // Try to update existing setting, if not exists, insert new one
      const existingSetting = await db
        .select()
        .from(settings)
        .where(eq(settings.key, key))
        .limit(1);

      if (existingSetting.length > 0) {
        // Update existing setting
        await db
          .update(settings)
          .set({
            value: stringValue,
            updatedAt: currentTime,
          })
          .where(eq(settings.key, key));
      } else {
        // Insert new setting
        await db.insert(settings).values({
          key,
          value: stringValue,
          category: getCategoryForKey(key),
          updatedAt: currentTime,
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

// Helper function to categorize settings
function getCategoryForKey(key: string): string {
  const brandingKeys = ['schoolName', 'logo', 'favicon', 'tagline'];
  const seoKeys = ['metaTitle', 'metaDescription', 'metaKeywords'];
  const contactKeys = ['address', 'phone', 'email', 'website'];
  const socialKeys = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];
  const schoolKeys = ['establishedYear', 'principalName', 'totalStudents', 'totalTeachers', 'footerText', 'copyrightText'];
  const systemKeys = ['timezone', 'dateFormat', 'currency', 'language', 'primaryColor', 'accentColor', 'enableDarkMode', 'enableAnimations'];

  if (brandingKeys.includes(key)) return 'branding';
  if (seoKeys.includes(key)) return 'seo';
  if (contactKeys.includes(key)) return 'contact';
  if (socialKeys.includes(key)) return 'social';
  if (schoolKeys.includes(key)) return 'school';
  if (systemKeys.includes(key)) return 'system';
  
  return 'general';
} 