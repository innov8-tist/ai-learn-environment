import { db } from '$/database/db';
import {  NewCloudFile, cloudTable } from '$/database/schema/cloud.schema';
import { eq } from 'drizzle-orm';

async function createCloudFile(file: NewCloudFile) {
  const insert = await db.insert(cloudTable).values(file).returning();
  return insert.at(0) || null;
}

async function getCloudFileById(id: string) {
  const file = await db.select().from(cloudTable).where(eq(cloudTable.id, id)).limit(1);
  return file.at(0) || null;
}

async function listCloudFilesByAuthor(authorId: string) {
  const files = await db.select().from(cloudTable).where(eq(cloudTable.author, authorId));
  return files;
}

export { createCloudFile, getCloudFileById, listCloudFilesByAuthor };
