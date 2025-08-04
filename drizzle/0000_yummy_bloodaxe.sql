CREATE TABLE "about_page" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" varchar(50) NOT NULL,
	"title" varchar(200),
	"content" text,
	"image" varchar(255),
	"order" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"pdatedAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY NOT NULL,
	"year" varchar(10) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"pdatedAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hero_slides" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(128) NOT NULL,
	"subtitle" varchar(256) NOT NULL,
	"image" varchar(256) NOT NULL,
	"order" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"pdatedAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"image" varchar(255),
	"author" text NOT NULL,
	"category" varchar(255),
	"date" varchar(50),
	"published" boolean DEFAULT false NOT NULL,
	"excerpt" text NOT NULL,
	"pdatedAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"pdatedAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "statistics" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(32) NOT NULL,
	"value" integer NOT NULL,
	"label" varchar(64) NOT NULL,
	"suffix" varchar(8) DEFAULT '',
	"pdatedAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "statistics_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "teacher_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"color" varchar(20),
	"pdatedAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"age" integer,
	"education" varchar(100),
	"subject" varchar(100),
	"experience" integer,
	"tagId" integer,
	"description" varchar(255),
	"image" varchar(255),
	"pdatedAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_tagId_teacher_tags_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."teacher_tags"("id") ON DELETE no action ON UPDATE no action;