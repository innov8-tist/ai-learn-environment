import { db } from '$/database/db';
import { NewChat, chatTable } from '$/database/schema/chat.schema'; // Assuming a similar schema exists
import { eq, desc } from 'drizzle-orm';

async function createChat(chat: NewChat) {
    const insert = await db.insert(chatTable).values(chat).returning();
    return insert.at(0) || null;
}

async function getChatById(id: string) {
    const chat = await db.select().from(chatTable).where(eq(chatTable.id, id)).limit(1);
    return chat.at(0) || null;
}

async function updateChat(id: string, updatedChat: Partial<NewChat>) {
    const result = await db.update(chatTable).set(updatedChat).where(eq(chatTable.id, id)).returning();
    return result.at(0) || null;
}

async function deleteChat(id: string) {
    const result = await db.delete(chatTable).where(eq(chatTable.id, id));
    if(!result.rowCount) return 0
    return result.rowCount > 0; 
}

async function listChatsByAuthor(authorId: string) {
    const chats = await db
        .select()
        .from(chatTable)
        .where(eq(chatTable.author, authorId))
        .orderBy(desc(chatTable.createdAt)); // Assuming createdAt exists
    return chats;
}

export { createChat, getChatById, updateChat, deleteChat, listChatsByAuthor }; 