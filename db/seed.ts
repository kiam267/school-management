import { statistics } from './schema/schema';
import { db } from './db';

export async function seedStatistics() {
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
      .insert(statistics)
      .values(stat)
      .onConflictDoNothing();
  }
  console.log('Seeded statistics');
}

if (require.main === module) {
  seedStatistics().then(() => process.exit(0));
}
