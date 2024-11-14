const { body, validationResult } = require('express-validator');

const validateBook = [
  body('title')
    .trim()
    .isString()
    .isLength({ min: 4, max: 120 })
    .withMessage('le titre doit contenir entre 4 et 120 caractères')
    .matches(/^[^\[\]{}$&.<>]*$/)
    .withMessage(
      'Le titre ne doit pas contenir les caractères [, ], {, }, $, &, ., <, ou >',
    ),
  body('author')
    .trim()
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage("le nom de l'auteur doit contenir entre 2 et 100 caractères")
    .matches(/^[^\[\]{}$&.<>]*$/)
    .withMessage(
      "L'auteur ne doit pas contenir les caractères [, ], {, }, $, &, ., <, ou >",
    ),
  body('year')
    .trim()
    .isInt({ min: 1000, max: 9999 })
    .withMessage("l'année doit être un nombre à 4 chiffres"),
  body('genre')
    .trim()
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage('le genre doit contenir entre 2 et 100 caractères')
    .matches(/^[^\[\]{}$&.<>]*$/)
    .withMessage(
      'Le genre ne doit pas contenir les caractères [, ], {, }, $, &, ., <, ou >',
    ),
  body('imageUrl').trim().isString(),
  body('ratings.*.grade')
    .isInt({ min: 1, max: 5 })
    .withMessage('Le grade doit être un nombre entier entre 1 et 5')
    .custom((value) => {
      if (!Number.isInteger(value)) {
        throw new Error('Le grade doit être un nombre entier');
      }
      return true;
    }),

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
