import { Schema } from 'mongoose';

const addressSchema = new Schema({
  postalCode: String,
  address1: String,
  address2: String,
}, {
  _id: false
})

export { addressSchema }