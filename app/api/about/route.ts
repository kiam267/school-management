import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import {
  aboutPage,
  achievements,
} from '@/db/schema/schema';
import { eq, and, desc } from 'drizzle-orm';

// GET about page data
export async function GET() {
  try {
    // Fetch about page sections
    const aboutSections = await db
      .select()
      .from(aboutPage)
      .where(eq(aboutPage.active, true))
      .orderBy(aboutPage.order);

    // Fetch achievements
    const achievementsData = await db
      .select()
      .from(achievements)
      .where(eq(achievements.active, true))
      .orderBy(achievements.order);

    return NextResponse.json({
      sections: aboutSections,
      achievements: achievementsData,
    });
  } catch (error) {
    console.error('Error fetching about page data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about page data' },
      { status: 500 }
    );
  }
}

// POST to update about page data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sections, achievements: achievementsData } =
      body;

    const currentTime = new Date().toISOString();

    // Update about page sections
    if (sections && Array.isArray(sections)) {
      for (const section of sections) {
        if (section.id) {
          // Update existing section
          await db
            .update(aboutPage)
            .set({
              title: section.title,
              content: section.content,
              image: section.image,
              order: section.order,
              updatedAt: currentTime,
            })
            .where(eq(aboutPage.id, section.id));
        } else {
          // Insert new section
          await db.insert(aboutPage).values({
            section: section.section,
            title: section.title,
            content: section.content,
            image: section.image,
            order: section.order,
            updatedAt: currentTime,
          });
        }
      }
    }

    // Update achievements
    if (
      achievementsData &&
      Array.isArray(achievementsData)
    ) {
      for (const achievement of achievementsData) {
        console.log(achievement);

        const existingAchievement = await db
          .select({
            id: achievements.id,
          })
          .from(achievements)
          .where(eq(achievements.id, achievement.id));

        if (existingAchievement.length > 0) {
          // Update existing achievement
          await db
            .update(achievements)
            .set({
              year: achievement.year,
              title: achievement.title,
              description: achievement.description,
              order: achievement.order,
              updatedAt: currentTime,
            })
            .where(eq(achievements.id, achievement.id));
        } else {
          // Insert new achievement
          console.log(
            'Inserting new achievement:',
            achievement
          );

          await db.insert(achievements).values({
            id: achievement.id,
            year: achievement.year,
            title: achievement.title,
            description: achievement.description,
            order: achievement.order,
            updatedAt: currentTime,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'About page data updated successfully',
    });
  } catch (error) {
    console.error('Error updating about page data:', error);
    return NextResponse.json(
      { error: 'Failed to update about page data' },
      { status: 500 }
    );
  }
}

// DELETE to remove an achievement
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { achievementId } = body;

    if (!achievementId) {
      return NextResponse.json(
        { error: 'Achievement ID is required' },
        { status: 400 }
      );
    }

    await db
      .delete(achievements)
      .where(eq(achievements.id, achievementId));

    return NextResponse.json({
      success: true,
      message: 'Achievement deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return NextResponse.json(
      { error: 'Failed to delete achievement' },
      { status: 500 }
    );
  }
}
