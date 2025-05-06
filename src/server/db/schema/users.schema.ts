import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }),
  image: varchar("image", { length: 256 }),
});

// db schemas
export const usersSchema = createSelectSchema(users);
export const usersInsertSchema = createInsertSchema(users);
export const usersUpdateSchema = createUpdateSchema(users);

//form schemas
export const usersUpdateFormSchema = usersSchema
  .omit({
    image: true,
  })
  .extend({
    lastName: z.string().optional(),
  });
export const userIdSchema = usersSchema.pick({ id: true });

export type User = z.infer<typeof usersSchema>;
