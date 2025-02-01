import type { Types } from "mongoose";

export interface User {
  id: Types.ObjectId;
  email: string;
  password: string;
}

export const users: User[] = []; 