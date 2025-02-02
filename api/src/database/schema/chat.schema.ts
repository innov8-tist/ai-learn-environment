import { text, pgTable, uuid, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { userTable } from './user.schema';

export const chatTable = pgTable('chats', {
  id: uuid('id').primaryKey(), // Unique identifier for each chat
  title: text('title').notNull(), // Title or summary of the chat
  messages: jsonb('messages').notNull(), // Array of messages in JSON format
  createdAt: timestamp('createdAt').defaultNow().notNull(), // Timestamp for when the chat was created
  author: uuid('author').references(() => userTable.id).notNull(), // Reference to the user who created the chat
});

export type Chat = typeof chatTable.$inferSelect;
export type NewChat = typeof chatTable.$inferInsert; 