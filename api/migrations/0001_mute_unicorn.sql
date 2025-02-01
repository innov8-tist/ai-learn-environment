CREATE TABLE IF NOT EXISTS "cloud" (
	"id" uuid PRIMARY KEY DEFAULT 'bda3ea61-ebe3-479c-900f-5f7347c4cb0c' NOT NULL,
	"filetype" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"fileSize" integer NOT NULL,
	"path" text NOT NULL,
	"author" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cloud" ADD CONSTRAINT "cloud_author_users_id_fk" FOREIGN KEY ("author") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
