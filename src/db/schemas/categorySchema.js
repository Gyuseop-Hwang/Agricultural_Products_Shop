import { Schema } from 'mongoose';

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

export { CategorySchema };
