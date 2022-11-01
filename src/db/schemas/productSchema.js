import { Schema } from 'mongoose';

const ProductSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        imageUrl: String,
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
    },
    {
        timestamps: true,
    }
);

export { ProductSchema };
