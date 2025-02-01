import { Request, Response, NextFunction } from 'express';
import { CustomError } from '$/classes/CustomError.class';
import { createCloudFile, getCloudFileById, listCloudFilesByAuthor } from '../services/cloud.services';
import { z } from 'zod';
import { v4 } from 'uuid';

export const createCloudFileSchema = z.object({
    id: z.string().min(1, 'Id is required'),
    section: z.string().min(1, 'Section is required'),
    filetype: z.string().min(1, 'File type is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(), // Optional field
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


async function uploadFileController(req: Request, res: Response, next: NextFunction) {
    try {
        const fileData = {
            section: req.body.section,
            filetype: req.body.filetype,
            title: req.body.title,
            description: req.body.description,
            fileSize: req.file?.size,
            path: req.file?.path,
            author: req.user?.id,
            id: v4()
        };

        const result = createCloudFileSchema.safeParse(fileData);
        if (!result.success) {
            return next(result.error);
        }

        const newFile = await createCloudFile(result.data);

        if (!newFile) {
            throw new CustomError(500, 'Failed to create cloud file');
        }

        res.status(201).json(newFile);
    } catch (error) {
        next(error);
    }
}


async function getCloudFileByIdController(req: Request, res: Response, next: NextFunction) {
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



export { getCloudFileByIdController, listCloudFilesByAuthorController, uploadFileController };
