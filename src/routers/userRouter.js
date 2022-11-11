import { Router } from 'express';
import { loginRequired, authRequired } from '../middlewares/index.js';
import { BadRequestError, ForbiddenError, wrapAsync } from '../utils/index.js';
import { userService } from '../services/index.js';
import { body, validationResult } from 'express-validator';

const userRouter = Router();

userRouter.post(
  '/register',
  body('fullName')
    .isString()
    .isLength({ min: 2 })
    .trim()
    .withMessage('성함은 최소 2자리 이상이어야 합니다.'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage(
      '올바른 이메일을 입력해주세요, 또한 대문자는 이메일에 포함할 수 없습니다.'
    ),
  body('password')
    .isAlphanumeric()
    .isLength({ min: 4 })
    .trim()
    .withMessage('패스워드는 최소 4자리 이상이어야 합니다.'),
  // body('passwordConfirmation').custom((value, { req }) => {
  //   if (value !== req.body.password) {
  //     throw new BadRequestError('Password confirmation does not match password');
  //   }
  //   return true;
  // }),
  wrapAsync(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new BadRequestError(
        errors
          .array()
          .map((error) => error.msg)
          .join(', ')
      );
    }

    const newUser = await userService.addUser(req.body);

    res.status(201).json(newUser);
  })
);

userRouter.post(
  '/login',
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage(
      '올바른 이메일을 입력해주세요, 또한 대문자는 이메일에 포함할 수 없습니다.'
    ),
  body('password')
    .isAlphanumeric()
    .isLength({ min: 4 })
    .trim()
    .withMessage('패스워드는 최소 4자리 이상이어야 합니다.'),
  wrapAsync(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new BadRequestError(
        errors
          .array()
          .map((error) => error.msg)
          .join(', ')
      );
    }

    const userToken = await userService.getUserToken(req.body);

    res.status(200).json(userToken);
  })
);

userRouter.get(
  '/users/userInfo',
  loginRequired,
  wrapAsync(async (req, res) => {
    const userInfo = await userService.getUserInfo(req.currentUserId);

    res.status(200).json(userInfo);
  })
);

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
      throw new BadRequestError(
        '사용자가 role을 수정할 수는 없습니다. 관리자 권한이 필요합니다.'
      );
    }

    const currentPassword = req.body.currentPassword;

    if (!currentPassword) {
      throw new ForbiddenError(
        '정보를 변경하려면, 현재의 비밀번호가 필요합니다.'
      );
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

userRouter.delete(
  '/users/withdrawal',
  loginRequired,
  wrapAsync(async (req, res) => {
    await userService.withdraw(req.currentUserId);

    res
      .status(200)
      .json({ result: 'success', message: '회원탈퇴 되셨습니다.' });
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

userRouter.delete(
  '/admin/withdrawal/:userId',
  loginRequired,
  authRequired,
  wrapAsync(async (req, res) => {
    const deletedUser = await userService.withdraw(req.params.userId);

    res.status(200).json({
      result: 'success',
      message: `${deletedUser.fullName} 회원을 삭제하였습니다.`,
    });
  })
);

export { userRouter };
