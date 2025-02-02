import express from 'express';
import {
    createChatController,
    getChatByIdController,
    updateChatController,
    deleteChatController,
    listChatsByAuthorController,
} from '$/controllers/chat.controller';

const chatRouter = express.Router();

chatRouter.post('/', createChatController);
chatRouter.get('/:id', getChatByIdController);
chatRouter.put('/:id', updateChatController);
chatRouter.delete('/:id', deleteChatController);
chatRouter.get('/author/:authorId', listChatsByAuthorController);

export default chatRouter; 