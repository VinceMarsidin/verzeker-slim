CREATE UNIQUE INDEX IF NOT EXISTS "reviews_company_user_unique" ON "reviews" ("company_id", "user_id");

