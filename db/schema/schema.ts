
import {
  pgTable,
  serial,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';

export const statistics = pgTable('statistics', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 32 }).notNull().unique(),
  value: integer('value').notNull(),
  label: varchar('label', { length: 64 }).notNull(),
  suffix: varchar('suffix', { length: 8 }).default(''),
});
