import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  uuid,
  text,
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

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  updatedAt: varchar('updated_at', {
    length: 50,
  }).notNull(),
});

export const aboutPage = pgTable('about_page', {
  id: serial('id').primaryKey(),
  section: varchar('section', { length: 50 }).notNull(),
  title: varchar('title', { length: 200 }),
  content: text('content'),
  image: varchar('image', { length: 255 }),
  order: integer('order').notNull(),
  active: boolean('active').notNull().default(true),
  updatedAt: varchar('updated_at', {
    length: 50,
  }).notNull(),
});

export const achievements = pgTable('achievements', {
  id: uuid('id').primaryKey(),
  year: varchar('year', { length: 10 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  order: integer('order').notNull(),
  active: boolean('active').notNull().default(true),
  updatedAt: varchar('updated_at', {
    length: 50,
  }).notNull(),
});

export const news = pgTable('news', {
  id: uuid('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  image: varchar('image', { length: 255 }),
  author: text('author').notNull(),
  category: varchar('category', { length: 255 }),
  date: varchar('date', { length: 50 }),
  published: boolean('published').notNull().default(false),
  createdAt: varchar('created_at', {
    length: 50,
  }).notNull(),
  excerpt: text('excerpt').notNull(),
  updatedAt: varchar('updated_at', {
    length: 50,
  }).notNull(),
});
