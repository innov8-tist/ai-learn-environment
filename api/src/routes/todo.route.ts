import express from 'express';
import {
    createTodoController,
    getTodoByIdController,
    updateTodoController,
    deleteTodoController,
    listTodosByAuthorController,
    toggleTodoController,
} from '$/controllers/todo.controller';

const todoRouter = express.Router();

todoRouter.post('/', createTodoController);
todoRouter.get('/:id', getTodoByIdController);
todoRouter.put('/:id', updateTodoController);
todoRouter.delete('/:id', deleteTodoController);
todoRouter.get('/author/:authorId', listTodosByAuthorController);
todoRouter.patch('/:id/toggle', toggleTodoController); // Add this line for toggling


export default todoRouter; 