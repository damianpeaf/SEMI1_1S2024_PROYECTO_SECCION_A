CREATE TABLE IF NOT EXISTS "users" (
	"name" text NOT NULL,
	CONSTRAINT "users_name_unique" UNIQUE("name")
);
