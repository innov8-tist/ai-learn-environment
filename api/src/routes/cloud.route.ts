import express from 'express';
import {
    uploadFileController,
    getCloudFileByIdController,
    listCloudFilesByAuthorController,
    DownloadFileController,
} from '$/controllers/cloud.controller';
import multer from 'multer';
import path from 'path';

const cloudRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, './../../../cloud/'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    },
});
const upload = multer({ storage });


cloudRouter.post('/', upload.single('file'), uploadFileController);
cloudRouter.get('/:id', getCloudFileByIdController);
cloudRouter.get('/author/:authorId', listCloudFilesByAuthorController);
cloudRouter.get('/download/:id',DownloadFileController)

export default cloudRouter
