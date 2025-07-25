CREATE TABLE "statistics" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(32) NOT NULL,
	"value" integer NOT NULL,
	"label" varchar(64) NOT NULL,
	"suffix" varchar(8) DEFAULT '',
	CONSTRAINT "statistics_key_unique" UNIQUE("key")
);
