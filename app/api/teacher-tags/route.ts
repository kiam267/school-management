import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { teacherTags } from '@/db/schema/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const result = await db.select().from(teacherTags);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [created] = await db
    .insert(teacherTags)
    .values(body)
    .returning();
  return NextResponse.json(created);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...update } = body;
  const [updated] = await db
    .update(teacherTags)
    .set(update)
    .where(eq(teacherTags.id, id))
    .returning();
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  await db
    .delete(teacherTags)
    .where(eq(teacherTags.id, id));
  return NextResponse.json({ success: true });
}
