ALTER TABLE "bank_accounts" DROP CONSTRAINT "bal_check";--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bal_check" CHECK ("bank_accounts"."balance" >= 0);