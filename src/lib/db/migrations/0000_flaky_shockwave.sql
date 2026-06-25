CREATE TYPE "public"."employment_type" AS ENUM('Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user', 'editor');--> statement-breakpoint
CREATE TABLE "about" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"bio" text NOT NULL,
	"long_bio" text,
	"dob" text,
	"place_of_birth" text,
	"gender" text,
	"avatar" text,
	"resume" text,
	"email" text,
	"phone" text,
	"location" text,
	"github" text,
	"linkedin" text,
	"twitter" text,
	"website" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blog_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"author" text NOT NULL,
	"email" text,
	"content" text NOT NULL,
	"approved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"cover_image" text,
	"category" text NOT NULL,
	"tags" text[],
	"read_time" integer DEFAULT 5,
	"published" boolean DEFAULT false,
	"featured" boolean DEFAULT false,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"issuer" text NOT NULL,
	"date" text NOT NULL,
	"expiry_date" text,
	"credential_id" text,
	"credential_url" text,
	"category" text NOT NULL,
	"skills" text[],
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text,
	"message" text NOT NULL,
	"read" boolean DEFAULT false,
	"replied" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" serial PRIMARY KEY NOT NULL,
	"degree" text NOT NULL,
	"institution" text NOT NULL,
	"field" text,
	"start_date" text NOT NULL,
	"end_date" text,
	"description" text,
	"location" text,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"location" text,
	"type" text DEFAULT 'Full-time',
	"start_date" text NOT NULL,
	"end_date" text,
	"current" boolean DEFAULT false,
	"description" text,
	"technologies" text[],
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"active" boolean DEFAULT true,
	"subscribed_at" timestamp DEFAULT now(),
	"unsubscribed_at" timestamp,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"page" text NOT NULL,
	"referrer" text,
	"country" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"technologies" text[],
	"github_url" text,
	"live_url" text,
	"image" text,
	"featured" boolean DEFAULT false,
	"stars" integer DEFAULT 0,
	"forks" integer DEFAULT 0,
	"watchers" integer DEFAULT 0,
	"language" text,
	"topics" text[],
	"github_data" jsonb,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "resumes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"file_url" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"version" text,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_name" text DEFAULT 'My Portfolio' NOT NULL,
	"site_description" text,
	"site_url" text,
	"google_analytics_id" text,
	"email_notifications" boolean DEFAULT true,
	"auto_sync_projects" boolean DEFAULT true,
	"maintenance_mode" boolean DEFAULT false,
	"custom_css" text,
	"custom_js" text,
	"footer_text" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"level" integer DEFAULT 0,
	"color" text,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" text NOT NULL,
	"url" text NOT NULL,
	"icon" text,
	"order" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"position" text,
	"company" text,
	"content" text NOT NULL,
	"avatar" text,
	"rating" integer DEFAULT 5,
	"featured" boolean DEFAULT false,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"image" text,
	"password" text,
	"role" "user_role" DEFAULT 'user',
	"bio" text,
	"website" text,
	"github" text,
	"twitter" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;