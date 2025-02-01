import { text, pgTable, uuid, timestamp, boolean } from 'drizzle-orm/pg-core';
import { userTable } from './user.schema';

export const todoTable = pgTable('todos', {
  id: uuid('id').primaryKey(),
  title: text('title').notNull(), // Title of the todo
  description: text('description'), // Optional description
  completed: boolean('completed').default(false).notNull(), // Indicates if the todo is completed
  createdAt: timestamp('createdAt').defaultNow().notNull(), // Timestamp for when the todo was created
  author: uuid('author').references(() => userTable.id).notNull(), // Reference to the user who created the todo
});

export type Todo = typeof todoTable.$inferSelect;
export type NewTodo = typeof todoTable.$inferInsert; 
