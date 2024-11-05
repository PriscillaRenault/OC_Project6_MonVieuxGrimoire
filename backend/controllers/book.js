const Book = require('../models/book');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Objet supprimé !' });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.updateBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete bookObject._userid;
  Book.findOne({ _id: req.params.id }).then((book) => {
    if (book.userId != req.auth.userId) {
      return res.status(401).json({ message: 'Requête non autorisée' });
    } else {
      Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id },
      )
        .then(() => res.status(200).json({ message: 'Livre modifié !' }))
        .catch((error) => res.status(401).json({ error }));
    }
  });
};

exports.rateBook = (req, res, next) => {
  const bookId = req.params.id;
  const bookObject = req.file;

  Book.findOne({ _id: bookId })
    .then((book) => {
      if (book) {
        if (req.body.rating > 5 || req.body.rating < 0) {
          return res.status(400).json({ error: 'note invalide' });
        }

        const newRating = {
          grade: req.body.rating,
          userId: req.auth.userId,
        };

        if (book.ratings.find((rating) => rating.userId === req.auth.userId)) {
          return res
            .status(400)
            .json({ error: 'Vous avez déjà noté ce livre' });
        }

        book.ratings.push(newRating);

        book.averageRating = parseFloat(
          (
            book.ratings.reduce((acc, rating) => acc + rating.grade, 0) /
            book.ratings.length
          ).toFixed(1),
        );

        const modifiedBook = {
          ...book.toObject(),
        };

        //save in db
        book
          .save()
          .then(() => {
            res.status(200).json(modifiedBook);
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(401).json({ error }));
};

exports.bestRating = (req, res, next) => {
  Book.find() // Trouver tous les livres
    .then((books) => {
      const topBooks = books
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 3); // Tri et slice
      res.status(200).json(topBooks); // Renvoi des livres
    })
    .catch((error) => res.status(400).json({ error })); // Gestion des erreurs
};
