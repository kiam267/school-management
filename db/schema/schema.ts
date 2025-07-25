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

export const teacherTags = pgTable('teacher_tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  color: varchar('color', { length: 20 }),
});

export const teachers = pgTable('teachers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  age: integer('age'),
  education: varchar('education', { length: 100 }),
  subject: varchar('subject', { length: 100 }),
  experience: integer('experience'),
  tagId: integer('tagId').references(() => teacherTags.id),
  description: varchar('description', { length: 255 }),
  image: varchar('image', { length: 255 }),
});
