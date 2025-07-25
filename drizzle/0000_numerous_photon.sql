CREATE TABLE "hero_slides" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(128) NOT NULL,
	"subtitle" varchar(256) NOT NULL,
	"image" varchar(256) NOT NULL,
	"order" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "statistics" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(32) NOT NULL,
	"value" integer NOT NULL,
	"label" varchar(64) NOT NULL,
	"suffix" varchar(8) DEFAULT '',
	CONSTRAINT "statistics_key_unique" UNIQUE("key")
);
