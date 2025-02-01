import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import type { Document } from 'mongoose';

const clienturl = "http://localhost:3000"
export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: 'User already exists' });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                email,
                password: hashedPassword
            });

            await user.save();

            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            // Store user data in session
            req.session.userId = user._id;
            req.user = {
                id: user._id,
                email: user.email
            };
            
            // Save the session
            await new Promise<void>((resolve, reject) => {
                req.session.save((err) => {
                    if (err) reject(err);
                    resolve();
                });
            });

            // Set proper CORS headers
            res.setHeader('Access-Control-Allow-Credentials', 'true');  // Fixed typo in header name
            res.setHeader('Access-Control-Allow-Origin', clienturl);

            res.json({ 
                message: 'Logged in successfully',
                user: {
                    id: user._id,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Login error:', error);  // Better error logging
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    async logout(req: Request, res: Response) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    res.status(500).json({ message: 'Error logging out' });
                    return;
                }
                res.json({ message: 'Logged out successfully' });
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
} 
