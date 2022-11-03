import { Router } from 'express';

import { loginRequired, authRequired } from '../middlewares';
import { AppError, wrapAsync } from '../utils';
import { userService } from '../services';
import { body, validationResult } from 'express-validator';

const userRouter = Router();

userRouter.post(
  '/register',
  body('fullName').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new AppError(400, 'Password confirmation does not match password');
    }
    return true;
  }),
  wrapAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors);
    }

    const newUser = await userService.addUser(req.body);
    res.status(201).json(newUser);
  })
);

// 로그인 api (아래는 /login 이지만, 실제로는 /api/login로 요청해야 함.)
userRouter.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 4 }),
  wrapAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors);
    }

    // req (request) 에서 데이터 가져오기
    const email = req.body.email;
    const password = req.body.password;

    // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const userToken = await userService.getUserToken(req.body);
    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
    res.status(200).json(userToken);
  })
);

userRouter.get(
  '/admin/userlist',
  loginRequired,
  authRequired,
  wrapAsync(async (req, res) => {
    // 전체 사용자 목록을 얻음
    const users = await userService.getUsers();

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(users);
  })
);

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
      throw new AppError(
        403,
        '정보를 변경하려면, 현재의 비밀번호가 필요합니다.'
      );
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

export { userRouter };
