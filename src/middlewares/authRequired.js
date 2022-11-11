<<<<<<< HEAD
import { userModel } from '../db'
import { AppError } from '../utils';
=======
import { userModel } from '../db/index.js';
import { ForbiddenError } from '../utils/index.js';
>>>>>>> dev

async function authRequired(req, res, next) {
  const userId = req.currentUserId;
  const user = await userModel.findById(userId);
  try {
    if (user.role !== 'administrator') {
<<<<<<< HEAD
      throw new AppError(403, "관리자가 아닙니다.")
    }
  }
  catch (err) {
    return next(err)
  }
  next()
=======
      throw new ForbiddenError('관리자가 아닙니다.');
    }
  } catch (err) {
    return next(err);
  }

  next();
>>>>>>> dev
}

export { authRequired };
