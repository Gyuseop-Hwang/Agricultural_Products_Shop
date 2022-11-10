import { Schema } from 'mongoose';
import { addressSchema } from './addressSchema.js';

const UserSchema = new Schema(
  {
    email: String,
    fullName: String,
    password: String,
    phoneNumber: String,
    address: addressSchema,
    role: {
      type: String,
      default: 'basic-user',
    },
  },
  {
    timestamps: true,
  }
);

export { UserSchema };
