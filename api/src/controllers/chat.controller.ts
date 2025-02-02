import { Request, Response, NextFunction } from 'express';
import { CustomError } from '$/classes/CustomError.class';
import { createChat, getChatById, updateChat, deleteChat, listChatsByAuthor } from '../services/chat.services';
import { z } from 'zod';
import { v4 } from 'uuid';

export const createChatSchema = z.object({
    id: z.string().uuid('Chat ID must be a valid UUID'),
    title: z.string().min(1, 'Title is required'),
    messages: z.array(z.string()).nonempty('Messages cannot be empty'), // Array of messages
    author: z.string().uuid('Author ID must be a valid UUID'),
});

const getChatByIdSchema = z.object({
    id: z.string().uuid('Chat ID must be a valid UUID'),
});

const updateChatSchema = z.object({
    id: z.string().uuid('Chat ID must be a valid UUID'),
    title: z.string().optional(), // Title is optional for updates
    messages: z.array(z.string()).optional(), // Messages are optional for updates
});

const listChatsByAuthorSchema = z.object({
    authorId: z.string().uuid('Author ID must be a valid UUID'),
});

async function createChatController(req: Request, res: Response, next: NextFunction) {
    try {
        const chatData = {
            title: req.body.title,
            messages: req.body.messages,
            author: req.user?.id,
            id: v4(),
        };

        const result = createChatSchema.safeParse(chatData);
        if (!result.success) {
            return next(result.error);
        }

        const newChat = await createChat(result.data);

        if (!newChat) {
            throw new CustomError(500, 'Failed to create chat');
        }

        res.status(201).json(newChat);
    } catch (error) {
        next(error);
    }
}

async function getChatByIdController(req: Request, res: Response, next: NextFunction) {
    const result = getChatByIdSchema.safeParse(req.params);

    if (!result.success) {
        return next(result.error);
    }

    const { id } = result.data;
    const chat = await getChatById(id);

    if (!chat) {
        throw new CustomError(404, 'Chat not found');
    }

    res.status(200).json(chat);
}

async function updateChatController(req: Request, res: Response, next: NextFunction) {
    const result = updateChatSchema.safeParse({ ...req.body, id: req.params.id });

    if (!result.success) {
        return next(result.error);
    }

    const updatedChat = await updateChat(result.data.id, result.data);

    if (!updatedChat) {
        throw new CustomError(404, 'Chat not found or failed to update');
    }

    res.status(200).json(updatedChat);
}

async function deleteChatController(req: Request, res: Response, next: NextFunction) {
    const result = getChatByIdSchema.safeParse(req.params);

    if (!result.success) {
        return next(result.error);
    }

    const { id } = result.data;
    const deleted = await deleteChat(id);

    if (!deleted) {
        throw new CustomError(404, 'Chat not found or failed to delete');
    }

    res.status(204).send(); // No content to send back
}

async function listChatsByAuthorController(req: Request, res: Response, next: NextFunction) {
    const result = listChatsByAuthorSchema.safeParse(req.params);
    if (!result.success) {
        return next(result.error);
    }
    const { authorId } = result.data;

    const chats = await listChatsByAuthor(authorId);
    res.status(200).json(chats);
}

export { 
    createChatController, 
    getChatByIdController, 
    updateChatController, 
    deleteChatController, 
    listChatsByAuthorController 
}; 