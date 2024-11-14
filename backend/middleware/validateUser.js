const { body, validationResult } = require('express-validator');

const validateUser = [
  body('email').isEmail().withMessage('Email non valide'),
  body('password')
    .isString()
    .isLength({ min: 4, max: 30 })
    .withMessage('Mot de passe doit contenir entre 4 et 30 caractères')
    .matches(/^[^\[\]{}$&."<>' ]*$/)
    .withMessage(
      'Le champ ne doit pas contenir les caractères [, ], {, }, $, &, ., <, >,\', "  ou des espaces',
    ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateUser;
