// image upload middleware
const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};
const sanitizeFileName = (filename) => {
  return filename.replace(/[^\w.-]/g, '').replace(/\s+/g, '-'); // Remove all non-word characters and replace spaces with hyphens
};
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/; //authorized extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true); // Fichier valide
  } else {
    cb(new Error('Seuls les fichiers JPG, JPEG et PNG sont autorisés'), false);
  }
};

const storage = multer.memoryStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = sanitizeFileName(file.originalname.split(' ').join('_'));
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: fileFilter,
}).single('image');
module.exports = upload;
