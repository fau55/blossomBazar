import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const cartSchema = new Schema({
    items: [
        {
            productId: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            priceAtPurchase: {
                type: Number,
                required: true
            },
            priceAfterDiscount: {
                type: Number,
                required: true
            },
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date
    }
});

const Cart = mongoose.model("Cart", cartSchema);

export { Cart };

