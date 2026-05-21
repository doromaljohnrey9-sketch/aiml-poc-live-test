CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"actor_id" uuid,
	"action" text NOT NULL,
	"entity_type" text,
	"entity_id" uuid,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "banned_phrases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"phrase" text NOT NULL,
	"added_by" uuid
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"generated_content_id" uuid,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "content_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"submitted_by" uuid,
	"input_type" text NOT NULL,
	"raw_input" text,
	"extracted_text" text,
	"context_note" text,
	"language" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "distribution_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"generated_content_id" uuid,
	"channel" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"scheduled_at" timestamp,
	"published_at" timestamp,
	"external_post_id" text,
	"error_message" text
);
--> statement-breakpoint
CREATE TABLE "engagement_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"distribution_log_id" uuid,
	"channel" text NOT NULL,
	"metric_type" text NOT NULL,
	"value" integer DEFAULT 0,
	"recorded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "generated_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"content_source_id" uuid,
	"generated_text" text NOT NULL,
	"channel_formats" jsonb,
	"language" text NOT NULL,
	"generation_attempt" integer DEFAULT 1,
	"model_used" text DEFAULT 'gpt-4',
	"prompt_version" text,
	"banned_phrase_hit" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "review_statuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"generated_content_id" uuid,
	"reviewed_by" uuid,
	"status" text NOT NULL,
	"checkbox_factual" boolean,
	"checkbox_nda_safe" boolean,
	"checkbox_tone" boolean,
	"rejection_reason" text,
	"reviewed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "system_config" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "banned_phrases" ADD CONSTRAINT "banned_phrases_added_by_profiles_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_generated_content_id_generated_content_id_fk" FOREIGN KEY ("generated_content_id") REFERENCES "public"."generated_content"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_sources" ADD CONSTRAINT "content_sources_submitted_by_profiles_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distribution_logs" ADD CONSTRAINT "distribution_logs_generated_content_id_generated_content_id_fk" FOREIGN KEY ("generated_content_id") REFERENCES "public"."generated_content"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engagement_metrics" ADD CONSTRAINT "engagement_metrics_distribution_log_id_distribution_logs_id_fk" FOREIGN KEY ("distribution_log_id") REFERENCES "public"."distribution_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_content" ADD CONSTRAINT "generated_content_content_source_id_content_sources_id_fk" FOREIGN KEY ("content_source_id") REFERENCES "public"."content_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_statuses" ADD CONSTRAINT "review_statuses_generated_content_id_generated_content_id_fk" FOREIGN KEY ("generated_content_id") REFERENCES "public"."generated_content"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_statuses" ADD CONSTRAINT "review_statuses_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_config" ADD CONSTRAINT "system_config_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_id_idx" ON "audit_logs" USING btree ("entity_id");--> statement-breakpoint
CREATE INDEX "banned_phrases_added_by_idx" ON "banned_phrases" USING btree ("added_by");--> statement-breakpoint
CREATE INDEX "blog_posts_generated_content_id_idx" ON "blog_posts" USING btree ("generated_content_id");--> statement-breakpoint
CREATE INDEX "content_sources_submitted_by_idx" ON "content_sources" USING btree ("submitted_by");--> statement-breakpoint
CREATE INDEX "distribution_logs_generated_content_id_idx" ON "distribution_logs" USING btree ("generated_content_id");--> statement-breakpoint
CREATE INDEX "engagement_metrics_distribution_log_id_idx" ON "engagement_metrics" USING btree ("distribution_log_id");--> statement-breakpoint
CREATE INDEX "generated_content_content_source_id_idx" ON "generated_content" USING btree ("content_source_id");--> statement-breakpoint
CREATE INDEX "review_statuses_generated_content_id_idx" ON "review_statuses" USING btree ("generated_content_id");--> statement-breakpoint
CREATE INDEX "review_statuses_reviewed_by_idx" ON "review_statuses" USING btree ("reviewed_by");--> statement-breakpoint
CREATE INDEX "system_config_updated_by_idx" ON "system_config" USING btree ("updated_by");