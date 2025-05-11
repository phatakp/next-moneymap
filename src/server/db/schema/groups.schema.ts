import { pgTable, primaryKey, text, uuid, varchar } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import type { z } from "zod";
import { users, usersSchema } from "./users.schema";

export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
});

export const groupUsers = pgTable(
  "group_users",
  {
    groupId: uuid("group_id")
      .references(() => groups.id)
      .notNull(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
  },
  (groupUsers) => [
    primaryKey({ columns: [groupUsers.groupId, groupUsers.userId] }),
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

//type
export type GroupWithUsers = z.infer<typeof groupsSchema> & {
  groupUsers: (z.infer<typeof groupUsersSchema> & {
    users: z.infer<typeof usersSchema>;
  })[];
};
