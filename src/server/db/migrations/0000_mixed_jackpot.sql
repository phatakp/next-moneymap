CREATE TYPE "public"."inv_type_enum" AS ENUM('Mutual-Fund', 'Equity', 'Deposit');--> statement-breakpoint
CREATE TYPE "public"."acct_type_enum" AS ENUM('Savings', 'Wallet', 'Investment', 'Credit-Card', 'Mortgage');--> statement-breakpoint
CREATE TYPE "public"."category_enum" AS ENUM('Food', 'Travel', 'Household', 'Bills', 'Personal', 'Health', 'Investment', 'Income', 'Transfer', 'Miscellaneous');--> statement-breakpoint
CREATE TABLE "bank_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"num" text NOT NULL,
	"name" varchar(256) NOT NULL,
	"balance" real NOT NULL,
	"value" real NOT NULL,
	"as_of_date" date DEFAULT now(),
	"inv_type" "inv_type_enum",
	"bank_id" uuid NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"is_default" boolean DEFAULT false,
	"is_asset" boolean DEFAULT false,
	"is_liquid" boolean DEFAULT false,
	CONSTRAINT "bal_check" CHECK ("bank_accounts"."balance" > 0)
);
--> statement-breakpoint
CREATE TABLE "equity_accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"curr_price" real NOT NULL,
	"buy_price" real NOT NULL,
	"quantity" integer NOT NULL,
	"prefix" varchar(200)
);
--> statement-breakpoint
CREATE TABLE "mf_accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"nav" real NOT NULL,
	"units" real NOT NULL,
	"is_sip" boolean DEFAULT false,
	"sip_amount" integer
);
--> statement-breakpoint
CREATE TABLE "banks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "acct_type_enum" DEFAULT 'Savings' NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid,
	"user_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" varchar(256),
	"amount" real NOT NULL,
	"date" timestamp DEFAULT now(),
	"category" "category_enum",
	"acct_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"is_income" boolean DEFAULT false,
	CONSTRAINT "amt_check" CHECK ("transactions"."amount" > 0)
);
--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_bank_id_banks_id_fk" FOREIGN KEY ("bank_id") REFERENCES "public"."banks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equity_accounts" ADD CONSTRAINT "equity_accounts_id_bank_accounts_id_fk" FOREIGN KEY ("id") REFERENCES "public"."bank_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mf_accounts" ADD CONSTRAINT "mf_accounts_id_bank_accounts_id_fk" FOREIGN KEY ("id") REFERENCES "public"."bank_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_users" ADD CONSTRAINT "group_users_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_acct_id_bank_accounts_id_fk" FOREIGN KEY ("acct_id") REFERENCES "public"."bank_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "banks_unique_idx" ON "banks" USING btree ("type","name");--> statement-breakpoint
CREATE UNIQUE INDEX "grp_users_unique_idx" ON "group_users" USING btree ("group_id","user_id");--> statement-breakpoint
CREATE INDEX "txn_date_index" ON "transactions" USING btree ("date");