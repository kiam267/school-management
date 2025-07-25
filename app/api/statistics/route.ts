import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { statistics } from '@/db/schema/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const stats = await db.select().from(statistics);
  return NextResponse.json(stats);
}

export async function POST(req: NextRequest) {
  const updates = await req.json();

  const stats = await db.select().from(statistics);

  if (stats.length === 0) {
    for (const stat of updates) {
      const work = await db
        .insert(statistics)
        .values({
          key: stat.key,
          value: stat.value,
          label: stat.label,
          suffix: stat.suffix,
        })
        .onConflictDoNothing();
    }
  } else {
    for (const stat of updates) {
      await db
        .update(statistics)
        .set({
          value: stat.value,
          label: stat.label,
          suffix: stat.suffix,
        })
        .where(eq(statistics.key, stat.key));
    }
  }

  return NextResponse.json({ success: true });
}

export async function PUT() {
  // Reset to initial values
  const initial = [
    {
      key: 'students',
      value: 1250,
      label: 'Total Students',
      suffix: '+',
    },
    {
      key: 'teachers',
      value: 85,
      label: 'Total Teachers',
      suffix: '+',
    },
    {
      key: 'classrooms',
      value: 45,
      label: 'Classrooms',
      suffix: '',
    },
    {
      key: 'books',
      value: 15000,
      label: 'Library Books',
      suffix: '+',
    },
    {
      key: 'computers',
      value: 120,
      label: 'Computers',
      suffix: '+',
    },
  ];
  for (const stat of initial) {
    await db
      .update(statistics)
      .set({
        value: stat.value,
        label: stat.label,
        suffix: stat.suffix,
      })
      .where(eq(statistics.key, stat.key));
  }
  return NextResponse.json({ success: true });
}
