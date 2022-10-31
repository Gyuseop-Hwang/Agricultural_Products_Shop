import { Schema } from 'mongoose';

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        // quantity: {
        //     type: Number,
        //     required: true,
        // },
        image: {
            type: String,
            required: true,
        },
        // description: {
        //     type: String,
        //     required: true,
        // },
        category: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'products',
        timestamps: true,
    }
);

export { ProductSchema };
