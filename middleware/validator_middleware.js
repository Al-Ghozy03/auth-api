const { validationResult } = require("express-validator");

function validationMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(442).json({ error: errors.mapped() });
  } else {
    return next();
  }
}

module.exports = {validationMiddleware}