jest.mock('jsonwebtoken');
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/index.js';
import { loginRequired } from './loginRequired.js';

describe('test loginRequired', () => {
  test('req.headers.authorization이 없어서 에러를 던진다.', () => {
    const req = {
      headers: {},
    };
    const res = jest.fn();
    const next = jest.fn();

    loginRequired(req, res, next);

    expect(next).toBeCalledWith(
      new UnauthorizedError('로그인한 유저만 사용할 수 있는 서비스입니다.')
    );
  });

  test('req.headers.authorization은 있지만 정상적인 토큰이 아니다.', () => {
    const req = {
      headers: {
        authorization: 'bearerToken thisIsBearerToken',
      },
    };
    const res = jest.fn();
    const next = jest.fn();

    loginRequired(req, res, next);

    expect(next).toBeCalledWith(
      new UnauthorizedError('정상적인 토큰이 아닙니다.')
    );
  });

  test('authorization으로 넘어온 토큰이 정상일 경우 다음 미들웨어로 간다.', () => {
    const req = {
      headers: {
        authorization: 'bearerToken thisIsBearerToken',
      },
    };
    const res = jest.fn();
    const next = jest.fn();

    jwt.verify.mockReturnValue({
      userId: 'success user',
    });

    loginRequired(req, res, next);

    expect(next).toBeCalledWith();
    expect(next).not.toBeCalledWith(
      new UnauthorizedError('로그인한 유저만 사용할 수 있는 서비스입니다.')
    );
    expect(next).not.toBeCalledWith(
      new UnauthorizedError('정상적인 토큰이 아닙니다.')
    );
  });
});
