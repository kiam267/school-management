import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { heroSlides } from '@/db/schema/schema';
import { eq } from 'drizzle-orm';
import { del } from '@vercel/blob';

export async function GET() {
  const slides = await db
    .select()
    .from(heroSlides)
    .orderBy(heroSlides.order);
  return NextResponse.json(slides);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const slide = await db
    .insert(heroSlides)
    .values(data)
    .returning();
  return NextResponse.json(slide[0]);
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  // Get previous image URL
  const prevSlide = await db
    .select()
    .from(heroSlides)
    .where(eq(heroSlides.id, data.id));
  const prevImageUrl = prevSlide[0]?.image;
  // If image changed and previous image is a Vercel Blob URL, delete it

  if (prevImageUrl && prevImageUrl !== data.image) {
    try {
      await del(prevImageUrl);
    } catch (err) {
      // Ignore delete errors
    }
  }
  await db
    .update(heroSlides)
    .set({
      title: data.title,
      subtitle: data.subtitle,
      image: data.image,
      order: data.order,
      active: data.active,
    })
    .where(eq(heroSlides.id, data.id));
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  // Get previous image URL
  const prevSlide = await db
    .select()
    .from(heroSlides)
    .where(eq(heroSlides.id, id));
  const prevImageUrl = prevSlide[0]?.image;
  // If previous image is a Vercel Blob URL, delete it
  if (prevImageUrl) {
    try {
      await del(prevImageUrl);
    } catch (err) {
      // Ignore delete errors
    }
  }
  await db.delete(heroSlides).where(eq(heroSlides.id, id));
  return NextResponse.json({ success: true });
}
