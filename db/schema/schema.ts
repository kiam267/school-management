import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core';

export const statistics = pgTable('statistics', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 32 }).notNull().unique(),
  value: integer('value').notNull(),
  label: varchar('label', { length: 64 }).notNull(),
  suffix: varchar('suffix', { length: 8 }).default(''),
});

export const heroSlides = pgTable('hero_slides', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 128 }).notNull(),
  subtitle: varchar('subtitle', { length: 256 }).notNull(),
  image: varchar('image', { length: 256 }).notNull(),
  order: integer('order').notNull(),
  active: boolean('active').notNull().default(true),
});
