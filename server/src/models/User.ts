import mongoose, { Schema, Document,Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId,
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IUser>('User', UserSchema); 
