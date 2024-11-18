const { body, validationResult } = require('express-validator');

const validateUser = [
  body('email').isEmail(),
  body('password')
    .isString()
    .isLength({ min: 4, max: 30 })
    .matches(/^[^\[\]{}$&."<>' ]*$/),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateUser;
