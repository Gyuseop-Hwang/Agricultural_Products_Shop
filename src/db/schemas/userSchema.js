<<<<<<< HEAD
import { Schema } from "mongoose";
=======
import { Schema } from 'mongoose';
import { addressSchema } from './addressSchema.js';
>>>>>>> dev

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    address: {
      type: new Schema(
        {
          postalCode: String,
          address1: String,
          address2: String,
        },
        {
          _id: false,
        }
      ),
      required: false,
    },
    role: {
      type: String,
<<<<<<< HEAD
      required: false,
      default: "basic-user",
=======
      default: 'basic-user',
>>>>>>> dev
    },
  },
  {
    timestamps: true,
  }
);

export { UserSchema };
