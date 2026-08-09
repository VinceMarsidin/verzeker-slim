CREATE TABLE "contact_berichten" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"naam" varchar(100) NOT NULL,
	"email" varchar(150) NOT NULL,
	"bericht" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "maatschappijen" (
	"id" serial PRIMARY KEY NOT NULL,
	"naam" text NOT NULL,
	"logo_url" text,
	"contact_email" text,
	CONSTRAINT "maatschappijen_naam_unique" UNIQUE("naam")
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "verzekeringen" (
	"id" serial PRIMARY KEY NOT NULL,
	"categorie" text NOT NULL,
	"type" text NOT NULL,
	"premie_bedrag" text NOT NULL,
	"maatschappij_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "verzekeringen" ADD CONSTRAINT "verzekeringen_maatschappij_id_maatschappijen_id_fk" FOREIGN KEY ("maatschappij_id") REFERENCES "public"."maatschappijen"("id") ON DELETE cascade ON UPDATE no action;