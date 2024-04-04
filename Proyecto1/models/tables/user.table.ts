import { pgTable, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users', {
    name: text('name')
        .notNull()
        .unique()
})

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
