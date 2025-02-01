import { db } from '$/database/db';
import { NewTodo, todoTable } from '$/database/schema/todo.schema';
import { eq } from 'drizzle-orm';

async function createTodo(todo: NewTodo) {
    const insert = await db.insert(todoTable).values(todo).returning();
    return insert.at(0) || null;
}

async function getTodoById(id: string) {
    const todo = await db.select().from(todoTable).where(eq(todoTable.id, id)).limit(1);
    return todo.at(0) || null;
}

async function updateTodo(updatedTodo: NewTodo) {
    const { id, ...data } = updatedTodo;
    const result = await db.update(todoTable).set(data).where(eq(todoTable.id, id)).returning();
    return result.at(0) || null;
}

async function deleteTodo(id: string) {
    const result = await db.delete(todoTable).where(eq(todoTable.id, id));
    if(result.rowCount == null){
        return 0 
    }
    return result.rowCount > 0 ; 
}

async function listTodosByAuthor(authorId: string) {
    const todos = await db.select().from(todoTable).where(eq(todoTable.author, authorId));
    return todos;
}

export { createTodo, getTodoById, updateTodo, deleteTodo, listTodosByAuthor }; 