import { pgTable, text, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { users } from "./users.schema";

export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
});

export const groupUsers = pgTable(
  "group_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    groupId: uuid("group_id").references(() => groups.id),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
  },
  (groupUsers) => [
    uniqueIndex("grp_users_unique_idx").on(
      groupUsers.groupId,
      groupUsers.userId,
    ),
  ],
);

//db schemas
export const groupsSchema = createSelectSchema(groups);
export const groupsInsertSchema = createInsertSchema(groups);
export const groupsUpdateSchema = createUpdateSchema(groups);

export const groupUsersSchema = createSelectSchema(groupUsers);
export const groupUsersInsertSchema = createInsertSchema(groupUsers);
export const groupUsersUpdateSchema = createUpdateSchema(groupUsers);

//form schemas
export const groupIdSchema = groupsSchema.pick({ id: true });
