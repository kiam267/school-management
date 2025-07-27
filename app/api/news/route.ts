import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { news } from '@/db/schema/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
// GET: List all news articles (most recent first) or fetch by id
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      // Fetch single news by id
      const single = await db
        .select()
        .from(news)
        .where(eq(news.id, id));
      if (single.length === 0) {
        return NextResponse.json(
          { error: 'News not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(single[0]);
    }
    // Fetch all news
    const newsList = await db
      .select()
      .from(news)
      .orderBy(desc(news.createdAt));
    return NextResponse.json(newsList);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// POST: Create a new news article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const currentTime = new Date().toISOString();
    const result = await db
      .insert(news)
      .values({
        id: uuid(),
        excerpt: body.excerpt,
        category: body.category,
        author: body.author,
        date: body.date,
        title: body.title,
        content: body.content,
        image: body.image,
        published: body.published ?? false,
        createdAt: currentTime,
        updatedAt: currentTime,
      })
      .returning();
    return NextResponse.json({
      success: true,
      news: result[0],
    });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing news article
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing news id' },
        { status: 400 }
      );
    }
    const currentTime = new Date().toISOString();
    const result = await db
      .update(news)
      .set({
        title: body.title,
        content: body.content,
        image: body.image,
        published: body.published,
        updatedAt: currentTime,
      })
      .where(eq(news.id, body.id))
      .returning();
    return NextResponse.json({
      success: true,
      news: result[0],
    });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a news article
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing news id' },
        { status: 400 }
      );
    }
    await db.delete(news).where(eq(news.id, body.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    );
  }
}
