const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp-config');
const validateBook = require('../middleware/validateBook');

const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);

router.post('/:id/rating', auth, bookCtrl.rateBook);

router.post('/', auth, validateBook, multer, sharp, bookCtrl.createBook);

router.get('/bestrating', bookCtrl.bestRating);

router.get('/:id', bookCtrl.getOneBook);

router.put('/:id', auth, validateBook, multer, sharp, bookCtrl.updateBook);

router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;
