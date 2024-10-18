import mongoose, { Document, Schema } from 'mongoose';

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: { productId: mongoose.Types.ObjectId; quantity: number }[];
}

const CartSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  items: [{ productId: { type: mongoose.Types.ObjectId, ref: 'Product' }, quantity: { type: Number, required: true } }],
});

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
