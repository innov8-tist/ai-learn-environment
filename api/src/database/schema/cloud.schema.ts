import { text, pgTable, uuid, timestamp, integer } from 'drizzle-orm/pg-core';
import { userTable } from './user.schema';
import { v4 as uuidv4 } from 'uuid';

export const cloudTable = pgTable('cloud', {
  id: uuid('id').primaryKey().default(uuidv4()),
  filetype: text('filetype').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  fileSize: integer('fileSize').notNull(),
  path: text('path').notNull(),
  author: uuid('author').references(() => userTable.id).notNull(),
});

export type CloudFile = typeof cloudTable.$inferSelect;
export type NewCloudFile = typeof cloudTable.$inferInsert;
