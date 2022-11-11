import { userModel } from '../db'
import { AppError } from '../utils';

async function authRequired(req, res, next) {
  const userId = req.currentUserId;
  const user = await userModel.findById(userId);
  try {
    if (user.role !== 'administrator') {
      throw new AppError(403, "관리자가 아닙니다.")
    }
  }
  catch (err) {
    return next(err)
  }
  next()
}

export { authRequired }