import { userModel } from '../db/index.js';
import { BadRequestError } from '../utils/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async addUser(userInfo) {
    const { email, fullName, password, phoneNumber, address } = userInfo;

    const user = await this.userModel.findByEmail(email);
    if (user) {
      throw new BadRequestError(
        '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.'
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
<<<<<<< HEAD
    const newUserInfo = { fullName, email, password: hashedPassword, phoneNumber, address };
    const createdNewUser = await this.userModel.create(newUserInfo);
    return createdNewUser;
=======
    const newUserInfo = {
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    };

    return await this.userModel.create(newUserInfo);
>>>>>>> dev
  }

  async getUserToken(loginInfo) {
    const { email, password } = loginInfo;

    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new BadRequestError(
        '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.'
      );
    }

    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
<<<<<<< HEAD
      throw new Error(
=======
      throw new BadRequestError(
>>>>>>> dev
        '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.'
      );
    }

    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);

    return { token };
  }

<<<<<<< HEAD
  async getUserInfo(id) {
    return await userModel.findById(id);
=======
  async getUserInfo(userId) {
    return await this.userModel.findById(userId);
>>>>>>> dev
  }

  async getUsers() {
<<<<<<< HEAD
    const users = await this.userModel.findAll();
    return users;
=======
    return await this.userModel.findAll();
>>>>>>> dev
  }

  async setUser(userInfoRequired, toUpdate) {
    const { userId, currentPassword } = userInfoRequired;

    let user = await this.userModel.findById(userId);

    if (!user) {
<<<<<<< HEAD
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
=======
      throw new BadRequestError(
        '가입 내역이 없습니다. 다시 한 번 확인해 주세요.'
      );
>>>>>>> dev
    }

    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new BadRequestError(
        '현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.'
      );
    }

    const { password } = toUpdate;

    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
    }

<<<<<<< HEAD
    user = await this.userModel.update({
      userId,
      update: toUpdate,
    });

    return user;
=======
    return await this.userModel.update({ userId, update: toUpdate });
>>>>>>> dev
  }

  async withdraw(userId) {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new BadRequestError(
        '가입 내역이 없습니다. 다시 한 번 확인해 주세요.'
      );
    }
    return await userModel.deleteUser(userId);
  }
}

const userService = new UserService(userModel);

export { userService };
