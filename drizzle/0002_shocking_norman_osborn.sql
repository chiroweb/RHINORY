ALTER TABLE "orders" ADD COLUMN "claim_status" text DEFAULT 'NONE' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "claim_reason" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "refund_amount" integer DEFAULT 0 NOT NULL;