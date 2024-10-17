import { Schema, model } from 'mongoose';

interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

export const User = model<IUser>('User', userSchema);
