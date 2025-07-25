CREATE TABLE "teacher_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"color" varchar(20)
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
	"image" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_tagId_teacher_tags_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."teacher_tags"("id") ON DELETE no action ON UPDATE no action;