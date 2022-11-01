export function wrapAsync(func) {
  return function (req, res, next) {
    func(req, res).catch(err => next(err))
  }
}

