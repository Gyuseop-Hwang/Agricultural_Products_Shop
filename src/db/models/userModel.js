import { model } from 'mongoose';
import { UserSchema } from '../schemas/userSchema.js';

const User = model('User', UserSchema);

export class UserModel {
  async findByEmail(email) {
<<<<<<< HEAD
    const user = await User.findOne({ email });
    return user;
  }

  async findById(userId) {
    const user = await User.findOne({ _id: userId });
    return user;
  }

  async create(userInfo) {
    const createdNewUser = await User.create(userInfo);
    return createdNewUser;
  }

  async findAll() {
    const users = await User.find({});
    return users;
  }

  async update({ userId, update }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    return updatedUser;
=======
    return await User.findOne({ email });
  }

  async findById(userId) {
    return await User.findOne({ _id: userId });
  }

  async create(userInfo) {
    return await User.create(userInfo);
  }

  async findAll() {
    return await User.find({});
  }

  async update({ userId, update }) {
    return await User.findOneAndUpdate({ _id: userId }, update, {
      returnOriginal: false,
    });
>>>>>>> dev
  }

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }
}

const userModel = new UserModel();

export { userModel };
