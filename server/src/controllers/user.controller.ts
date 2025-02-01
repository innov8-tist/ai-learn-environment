import type { Request, Response } from 'express';

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    console.log(req.user)
    try {
      res.status(200).json({ message: 'Get all users' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      res.status(200).json({ message: `Get user ${id}` });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const userData = req.body;
      res.status(201).json({ message: 'User created', data: userData });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 