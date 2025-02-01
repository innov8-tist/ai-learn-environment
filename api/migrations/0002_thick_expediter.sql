ALTER TABLE "cloud" ALTER COLUMN "id" SET DEFAULT '96e1b8bd-a2f1-4127-9dce-df48e7d36b20';--> statement-breakpoint
ALTER TABLE "cloud" ADD COLUMN "section" text NOT NULL;--> statement-breakpoint
ALTER TABLE "cloud" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "cloud" ADD COLUMN "description" text;