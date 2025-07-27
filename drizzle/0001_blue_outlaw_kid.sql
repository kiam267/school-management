CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"image" varchar(255),
	"published" boolean DEFAULT false NOT NULL,
	"created_at" varchar(50) NOT NULL,
	"updated_at" varchar(50) NOT NULL
);
