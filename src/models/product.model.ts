import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  quantity: number;
  owner: mongoose.Types.ObjectId; // Reference to the owner (user)
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  owner: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, // Associate product with user
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
