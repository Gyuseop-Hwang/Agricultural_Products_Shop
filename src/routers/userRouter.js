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
    console.log(errors);
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
  '/users/userInfo',
  loginRequired,
  wrapAsync(async (req, res) => {

    const fullName = req.body.fullName;
    const password = req.body.password;
    const address = req.body.address;
    const phoneNumber = req.body.phoneNumber;
    const role = req.body.role;
    if (role) {
      throw new BadRequestError('사용자가 role을 수정할 수는 없습니다. 관리자 권한이 필요합니다.');
    }

    const currentPassword = req.body.currentPassword;

    if (!currentPassword) {
      throw new FrobiddenError('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
    }

    const userInfoRequired = { userId: req.currentUserId, currentPassword };

    const toUpdate = {
      ...(fullName && { fullName }),
      ...(password && { password }),
      ...(address && { address }),
      ...(phoneNumber && { phoneNumber }),
    };

    const updatedUserInfo = await userService.setUser(
      userInfoRequired,
      toUpdate
    );

    res.status(200).json(updatedUserInfo);
  })
);

userRouter.delete('/users/withdrawal', loginRequired, wrapAsync(async (req, res) => {
  await userService.withdraw(req.currentUserId);
  res.status(200).json({ result: "success", message: "회원탈퇴 되셨습니다." })
}))

userRouter.get(
  '/admin/userlist',
  loginRequired,
  authRequired,
  wrapAsync(async (req, res) => {
    const users = await userService.getUsers();
    res.status(200).json(users);
  })
);

userRouter.delete('/admin/withdrawal/:userId', loginRequired, authRequired, async (req, res) => {
  const { userId } = req.params;
  const deletedUser = await userService.withdraw(userId);
  res.status(200).json({ result: "success", message: `${deletedUser.fullName} 회원을 삭제하였습니다.` })
})


export { userRouter };
