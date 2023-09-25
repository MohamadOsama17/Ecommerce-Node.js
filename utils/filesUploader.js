const multer = require('multer');

const configureStorage = (folderPath) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname.replace(' ', '-')}`;
    cb(null, fileName);
  }
});

const createUploader = (folderPath, limits) => {
  return multer({ storage: configureStorage(folderPath), limits: limits });
}

module.exports = createUploader;