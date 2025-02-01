import { Request, Response, NextFunction } from 'express';
import { CustomError } from '$/classes/CustomError.class';
import { createTodo, getTodoById, updateTodo, deleteTodo, listTodosByAuthor } from '../services/todo.services';
import { z } from 'zod';
import { v4 } from 'uuid';

export const createTodoSchema = z.object({
    id: z.string().uuid('Todo ID must be a valid UUID').optional(), // Optional for creation
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(), 
    completed: z.boolean().default(false), 
    author: z.string().uuid('Author ID must be a valid UUID'),
});

const getTodoByIdSchema = z.object({
    id: z.string().uuid('Todo ID must be a valid UUID'),
});

const updateTodoSchema = z.object({
    id: z.string().uuid('Todo ID must be a valid UUID'),
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
});

const listTodosByAuthorSchema = z.object({
    authorId: z.string().uuid('Author ID must be a valid UUID'),
});

const toggleTodoSchema = z.object({
    id: z.string().uuid('Todo ID must be a valid UUID'),
});

async function createTodoController(req: Request, res: Response, next: NextFunction) {
    try {
        const todoData = {
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed,
            author: req.user?.id,
            id: v4()
        };

        const result = createTodoSchema.safeParse(todoData);
        if (!result.success) {
            return next(result.error);
        }

        const newTodo = await createTodo({ ...result.data, id: result.data.id! });

        if (!newTodo) {
            throw new CustomError(500, 'Failed to create todo');
        }

        res.status(201).json(newTodo);
    } catch (error) {
        next(error);
    }
}

async function getTodoByIdController(req: Request, res: Response, next: NextFunction) {
    const result = getTodoByIdSchema.safeParse(req.params);

    if (!result.success) {
        return next(result.error);
    }

    const { id } = result.data;
    const todo = await getTodoById(id);

    if (!todo) {
        throw new CustomError(404, 'Todo not found');
    }

    res.status(200).json(todo);
}

async function updateTodoController(req: Request, res: Response, next: NextFunction) {
    const result = updateTodoSchema.safeParse({ ...req.body, id: req.params.id });

    if (!result.success) {
        return next(result.error);
    }

    const existingTodo = await getTodoById(req.params.id);
    if (!existingTodo) {
        throw new CustomError(404, 'Todo not found');
    }
    const updatedTodo = await updateTodo({ 
        ...result.data, 
        author: existingTodo.author, 
        title: result.data.title ?? existingTodo.title // Ensure title is always a string
    });

    if (!updatedTodo) {
        throw new CustomError(404, 'Todo not found or failed to update');
    }

    res.status(200).json(updatedTodo);
}

async function deleteTodoController(req: Request, res: Response, next: NextFunction) {
    const result = getTodoByIdSchema.safeParse(req.params);

    if (!result.success) {
        return next(result.error);
    }

    const { id } = result.data;
    const deleted = await deleteTodo(id);

    if (!deleted) {
        throw new CustomError(404, 'Todo not found');
    }

    res.status(204).send(); // No content to send back
}

async function listTodosByAuthorController(req: Request, res: Response, next: NextFunction) {
    const result = listTodosByAuthorSchema.safeParse(req.params);
    if (!result.success) {
        return next(result.error);
    }
    const { authorId } = result.data;

    const todos = await listTodosByAuthor(authorId);
    res.status(200).json(todos);
}

async function toggleTodoController(req: Request, res: Response, next: NextFunction) {
    const result = toggleTodoSchema.safeParse(req.params);

    if (!result.success) {
        return next(result.error);
    }

    const { id } = result.data;
    const existingTodo = await getTodoById(id);
    if (!existingTodo) {
        throw new CustomError(404, 'Todo not found');
    }

    const updatedTodo = await updateTodo({ 
        id, 
        completed: !existingTodo.completed, // Toggle the completed status
        author: existingTodo.author, 
        title: existingTodo.title // Keep the existing title
    });

    if (!updatedTodo) {
        throw new CustomError(404, 'Todo not found or failed to update');
    }

    res.status(200).json(updatedTodo);
}

export { createTodoController, getTodoByIdController, updateTodoController, deleteTodoController, listTodosByAuthorController, toggleTodoController }; 
