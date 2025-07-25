import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { teachers } from '@/db/schema/schema';
import { eq } from 'drizzle-orm';
import { del } from '@vercel/blob';

export async function GET() {
  const result = await db.select().from(teachers);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [created] = await db
    .insert(teachers)
    .values(body)
    .returning();
  return NextResponse.json(created);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, image, ...update } = body;

  // Fetch the current teacher to get the existing image
  const [currentTeacher] = await db
    .select()
    .from(teachers)
    .where(eq(teachers.id, id));

  if (
    currentTeacher?.image &&
    currentTeacher.image !== image
  ) {
    try {
      await del(currentTeacher.image); // Delete old image
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  }

  const [updated] = await db
    .update(teachers)
    .set(update)
    .where(eq(teachers.id, id))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  // Fetch the current teacher to get the existing image
  const [currentTeacher] = await db
    .select()
    .from(teachers)
    .where(eq(teachers.id, id));

  if (currentTeacher?.image) {
    try {
      await del(currentTeacher.image); // Delete image
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  }

  await db.delete(teachers).where(eq(teachers.id, id));

  return NextResponse.json({ success: true });
}
