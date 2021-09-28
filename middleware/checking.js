const User = require('../models/userRole/user');
const validationerror = require('../middleware/validationError');

exports.userById = (req, res, next) => {
  let userId = req.params.userId;
  let user = User.findOne({ userId: userId }).exec((err, user) => {
    if(err || !user) {
      return next(
        new validationError('User not found',400)
      );
    }
    req.profile = user;
    next();
  })
}
