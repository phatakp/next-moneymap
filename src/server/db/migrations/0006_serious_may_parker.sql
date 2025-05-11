CREATE TYPE "public"."group_txn_type_enum" AS ENUM('Split', 'To-Pay-Full', 'To-Get-Full');--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "grp_txn_type" "group_txn_type_enum";