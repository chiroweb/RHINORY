CREATE TABLE "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"recipient_name" text DEFAULT '' NOT NULL,
	"recipient_phone" text DEFAULT '' NOT NULL,
	"postal_code" text DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"detail_address" text DEFAULT '' NOT NULL,
	"delivery_note" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "members_phone_unique" UNIQUE("phone")
);
