import { model } from 'mongoose';
import { UserSchema } from '../schemas/userSchema.js';

const User = model('User', UserSchema);

export class UserModel {
  async findByEmail(email) {
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
  }

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }
}

const userModel = new UserModel();

export { userModel };
