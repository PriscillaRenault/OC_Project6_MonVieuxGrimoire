const sharp = require('sharp');
const path = require('path');

module.exports = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const outputFilename = `${
      req.file.originalname.split(' ').join('_').split('.')[0]
    }_${Date.now()}.webp`;
    const outputPath = path.join(__dirname, '..', 'images', outputFilename);

    // Conversion webp and resize from buffer
    await sharp(req.file.buffer)
      .resize({ height: 456 })
      .toFormat('webp')
      .toFile(outputPath);

    // update `req.file` to point to the new file
    req.file.filename = outputFilename;
    req.file.path = outputPath;

    next();
  } catch (err) {
    next(err);
  }
};
