import { AppError } from "../utils"

export function notFound(req, res, next) {
  const error = new AppError(404, "리소스를 찾을 수 없습니다. 올바르지 않은 URL입니다.")
  next(error)
}