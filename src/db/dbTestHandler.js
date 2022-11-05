import { userModel } from './models/userModel';
import { categoryModel } from './models/categoryModel';
import { productModel } from './models/productModel';
import { orderModel } from './models/orderModel';

export const dbTestHandler = async (db) => {
  userModel.create({
    _id: '63632d4ddfb91201fe8d5eec',
    email: 'root@root.com',
    fullName: 'root',
    phoneNumber: '010-2342-1342',
    address: {
      postalCode: '12345',
      address1: '서울시 행복구 행복동',
      address2: '광주시 광산구 산정동',
    },
    password: '$2b$10$6fPyrhFvBgMUZbjIwnlapOoieg8fSXJem9HldX6mggagG5XDGy0l2',
  });

  userModel.create({
    _id: '63632d4ddfb91201fe8d5ea6',
    email: 'rbtjq@rbtjq.com',
    fullName: '황규섭',
    phoneNumber: '010-1942-5923',
    address: {
      postalCode: '52734',
      address1: '익산시 행복구 행복동',
      address2: '천안시 동구 불당동',
    },
    password: '$2b$10$6fPyrhFvBgMUZbjIwnlapOoieg8fSXJem9HldX6mggagG5XDGy0l2',
  });

  userModel.create({
    _id: '63632d4ddfb91201fe8d5e10',
    email: 'doyeon@doyeon.com',
    fullName: '이도연',
    phoneNumber: '010-1521-3526',
    address: {
      postalCode: '52734',
      address1: '정읍시 수성구 수성동',
      address2: '광주시 광산구 운남동',
    },
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
    name: '과일',
    total: 2,
  });
  categoryModel.create({
    _id: '63613687b3cd1137208c7e7a',
    name: '야채',
    total: 1,
  });
  categoryModel.create({
    _id: '63613692b3cd1137208c7e7c',
    name: '견과류',
    total: 1,
  });
  categoryModel.create({
    _id: '63614045b3cd1137208c7ea2',
    name: '버섯류',
    total: 1,
  });

  productModel.createProduct({
    _id: '6363578739bd781e3f24e275',
    title: '상쾌한 복숭아',
    image: {
      path: "https://images.unsplash.com/photo-1639588473831-dd9d014646ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
    },
    price: 5000,
    quantity: 6,
    description: 'test',
    category: '63613676b3cd1137208c7e78',
  });
  productModel.createProduct({
    _id: '6363578739bd781e3f24e276',
    title: '아삭아삭 사과',
    image: {
      path: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
    },
    price: 4000,
    quantity: 6,
    description: 'test',
    category: '63613676b3cd1137208c7e78',
  });
  productModel.createProduct({
    _id: '6363578739bd781e3f24e277',
    title: '신선한 상추',
    imageUrl: {
      path: "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1031&q=80"
    },
    price: 2000,
    quantity: 10,
    description: 'test',
    category: '63613687b3cd1137208c7e7a',
  });
  productModel.createProduct({
    _id: '6363578739bd781e3f24e278',
    title: '똑똑한 호두',
    imageUrl: {
      path: "https://images.unsplash.com/flagged/photo-1579410137922-543ed48d263e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80"
    },
    price: 10000,
    quantity: 2,
    description: 'test',
    category: '63613692b3cd1137208c7e7c',
  });
  productModel.createProduct({
    _id: '6363578739bd781e3f24e279',
    title: '영양만점 버섯',
    imageUrl: {
      path: "https://images.unsplash.com/photo-1571074635691-b910c7a5cdbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=903&q=80"
    },
    price: 3000,
    quantity: 7,
    description: 'test',
    category: '63614045b3cd1137208c7ea2',
  });

  orderModel.create({
    _id: '6363834966e64222e7cf64db',
    recipient: 'root',
    phoneNumber: '010-0000-0000',
    totalPrice: 23000,
    products: [
      {
        product: '6363578739bd781e3f24e279',
        count: 1,
      },
      {
        product: '6363578739bd781e3f24e278',
        count: 2,
      },
    ],
    shippingAddress: {
      postalCode: '처음 postalCode',
      address1: '처음 address1',
      address2: '처음 address2',
    },
    user: '63632d4ddfb91201fe8d5eec',
  });

  process.on('SIGINT', async () => {
    await db.dropDatabase();

    console.log('DB clear!');
    process.exit();
  });
};
