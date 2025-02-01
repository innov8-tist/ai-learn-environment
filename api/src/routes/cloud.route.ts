import express from 'express';
import {
  createCloudFileController,
  getCloudFileByIdController,
  listCloudFilesByAuthorController,
} from '$/controllers/cloud.controller';

const cloudRouter = express.Router();

cloudRouter.post('/', createCloudFileController);

cloudRouter.get('/:id', getCloudFileByIdController);

cloudRouter.get('/author/:authorId', listCloudFilesByAuthorController);

export default cloudRouter
