CREATE TYPE "public"."region" AS ENUM('suriname', 'aruba', 'curacao', 'bonaire', 'trinidad', 'jamaica', 'guyana', 'french-guiana');--> statement-breakpoint
CREATE TYPE "public"."insurance_type" AS ENUM('motor', 'reis', 'woon', 'leven');--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"naam" varchar(100) NOT NULL,
	"email" varchar(150) NOT NULL,
	"bericht" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"logo_initial" varchar(2) NOT NULL,
	"region" "region" NOT NULL,
	"website" varchar(300) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "companies_slug_unique" UNIQUE("slug")
);

CREATE TABLE "premiums" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" integer NOT NULL,
	"insurance_type" "insurance_type" NOT NULL,
	"monthly_premium" real NOT NULL,
	"currency" varchar(10) NOT NULL,
	"deductible" real NOT NULL,
	"rating" real NOT NULL,
	"coverage" text[] NOT NULL,
	"badge" varchar(20),
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" integer NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"user_name" varchar(100) NOT NULL,
	"rating" integer NOT NULL,
	"title" varchar(150) NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "premiums" ADD CONSTRAINT "premiums_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
