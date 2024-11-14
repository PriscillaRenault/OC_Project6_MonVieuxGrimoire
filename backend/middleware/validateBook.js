const { body, validationResult } = require('express-validator');

const validateBook = [
  body('title').trim(),

  body('author').trim(),

  body('year').trim(),
  body('genre').trim(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateBook;
