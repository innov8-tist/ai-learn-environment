import { Request, Response, NextFunction } from 'express';
import { CustomError } from '$/classes/CustomError.class';
import { createCloudFile, getCloudFileById, listCloudFilesByAuthor } from '../services/cloud.services';
import { z } from 'zod';

const createCloudFileSchema = z.object({
    filetype: z.string().min(1, 'File type is required'),
    fileSize: z.number().positive('File size must be a positive number'),
    path: z.string().min(1, 'File path is required'),
    author: z.string().uuid('Author ID must be a valid UUID'),
});

const getCloudFileByIdSchema = z.object({
    id: z.string().uuid('File ID must be a valid UUID'),
});

const listCloudFilesByAuthorSchema = z.object({
    authorId: z.string().uuid('Author ID must be a valid UUID'),
});

async function createCloudFileController(req: Request, res: Response, next: NextFunction) {
    const result = createCloudFileSchema.safeParse(req.body);

    if (!result.success) {
        return next(result.error);
    }

    const { filetype, fileSize, path, author } = result.data;
    const newFile = await createCloudFile({ filetype, fileSize, path, author, });

    if (!newFile) {
        throw new CustomError(500, 'Failed to create cloud file');
    }

    res.status(201).json(newFile);
}


async function getCloudFileByIdController(req: Request, res: Response, next: NextFunction) {
    console.log("Hehhah");
    const result = getCloudFileByIdSchema.safeParse(req.params);

    if (!result.success) {
        return next(result.error);
    }

    const { id } = result.data;
    const file = await getCloudFileById(id);

    if (!file) {
        throw new CustomError(404, 'File not found');
    }

    res.status(200).json(file);
}


async function listCloudFilesByAuthorController(req: Request, res: Response, next: NextFunction) {
    const result = listCloudFilesByAuthorSchema.safeParse(req.params);
    if (!result.success) {
        return next(result.error);
    }
    const { authorId } = result.data;

    const files = await listCloudFilesByAuthor(authorId);
    res.status(200).json(files);
}

export { createCloudFileController, getCloudFileByIdController, listCloudFilesByAuthorController };
