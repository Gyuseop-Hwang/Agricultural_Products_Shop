import { Router } from 'express';

import { loginRequired, authRequired } from '../middlewares';
import { BadRequestError, FrobiddenError, wrapAsync } from '../utils';
import { userService } from '../services';
import { body, validationResult } from 'express-validator';

const userRouter = Router();

userRouter.post(
  '/register',
  body('fullName').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  // body('passwordConfirmation').custom((value, { req }) => {
  //   if (value !== req.body.password) {
  //     throw new BadRequestError('Password confirmation does not match password');
  //   }
  //   return true;
  // }),
  wrapAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError(errors);
    }

    const newUser = await userService.addUser(req.body);
    res.status(201).json(newUser);
  })
);

userRouter.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 4 }),
  wrapAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError(errors);
    }

    const userToken = await userService.getUserToken(req.body);
    res.status(200).json(userToken);
  })
);

userRouter.get('/users/userInfo', loginRequired, async (req, res) => {
  const userInfo = await userService.getUserInfo(req.currentUserId);
  res.status(200).json(userInfo);
})

userRouter.patch(
  '/users/:userId',
  loginRequired,
  wrapAsync(async (req, res) => {
    const userId = req.params.userId;

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const fullName = req.body.fullName;
    const password = req.body.password;
    const address = req.body.address;
    const phoneNumber = req.body.phoneNumber;
    const role = req.body.role;

    // body data로부터, 확인용으로 사용할 현재 비밀번호를 추출함.
    const currentPassword = req.body.currentPassword;

    // currentPassword 없을 시, 진행 불가
    if (!currentPassword) {
      throw new FrobiddenError('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
    }

    const userInfoRequired = { userId, currentPassword };

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(fullName && { fullName }),
      ...(password && { password }),
      ...(address && { address }),
      ...(phoneNumber && { phoneNumber }),
      ...(role && { role }),
    };

    // 사용자 정보를 업데이트함.
    const updatedUserInfo = await userService.setUser(
      userInfoRequired,
      toUpdate
    );

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(updatedUserInfo);
  })
);

userRouter.get(
  '/admin/userlist',
  loginRequired,
  authRequired,
  wrapAsync(async (req, res) => {
    const users = await userService.getUsers();
    res.status(200).json(users);
  })
);

export { userRouter };
