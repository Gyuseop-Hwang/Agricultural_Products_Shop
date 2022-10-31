import { model } from 'mongoose';
import { ProductSchema } from '../schemas/productSchema';

const Product = model('Product', ProductSchema);

export class ProductModel {

}