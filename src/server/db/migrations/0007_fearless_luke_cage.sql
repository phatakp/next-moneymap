DROP INDEX "grp_users_unique_idx";--> statement-breakpoint
ALTER TABLE "group_users" ALTER COLUMN "group_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "group_users" DROP CONSTRAINT "group_users_user_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "group_users" DROP COLUMN "id";
ALTER TABLE "group_users" ADD CONSTRAINT "group_users_group_id_user_id_pk" PRIMARY KEY("group_id","user_id");--> statement-breakpoint