import { userModel } from './models/userModel';
import { categoryModel } from './models/categoryModel';
import { productModel } from './models/productModel';
import { orderModel } from './models/orderModel';

export const dbTestHandler = async (db) => {
  userModel.create({
    _id: '63632d4ddfb91201fe8d5eec',
    email: 'root@root.com',
    fullName: 'root',
    password: '$2b$10$6fPyrhFvBgMUZbjIwnlapOoieg8fSXJem9HldX6mggagG5XDGy0l2',
  });
  userModel.create({
    _id: '63632dd4c8448e8c61c6a82a',
    email: 'admin@admin.com',
    fullName: 'admin',
    password: '$2b$10$6fPyrhFvBgMUZbjIwnlapOoieg8fSXJem9HldX6mggagG5XDGy0l2',
    role: 'administrator',
  });

  categoryModel.create({
    _id: '63613676b3cd1137208c7e78',
    name: 'fruit',
  });
  categoryModel.create({
    _id: '63613687b3cd1137208c7e7a',
    name: 'vegetable',
  });
  categoryModel.create({
    _id: '63613692b3cd1137208c7e7c',
    name: 'nut',
  });
  categoryModel.create({
    _id: '63614045b3cd1137208c7ea2',
    name: 'fungi',
  });

  // productModel.addProduct({
  //   title: '상쾌한 복숭아',
  //   imageUrl: 'test',
  //   price: 5000,
  //   quantity: 6,
  //   description: 'test',
  // });

  orderModel.create({
    recipient: 'root',
    phoneNumber: '010-0000-0000',
    products: [
      {
        productId: '635fa5d1301bb04f51c6c44a',
        quantity: 1,
      },
      {
        productId: '635fa5d5301bb04f51c6c44c',
        quantity: 1,
      },
    ],
    shippingAddress: '도착지',
    userId: '63632d4ddfb91201fe8d5eec',
  });

  process.on('SIGINT', async () => {
    await db.dropDatabase();

    console.log('DB clear!');
    process.exit();
  });
};
