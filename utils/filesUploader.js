const multer = require('multer');

const fs = require('fs');
const path = require('path');

const uuid = require('uuid');

const configureStorage = (folderPath) => multer.diskStorage({
  destination: async (req, file, cb) => {
    // console.log('destination-npm ----');
    // console.log(req.body);
    // console.log(uuid.v4());
    // const tempFolderName = Date.now().toString();
    // req.tempFolderName = tempFolderName;

    // const newFolderPath = path.join(folderPath,tempFolderName)
    // fs.mkdir(newFolderPath, (err) => {
    //   if (err) {
    //     console.error(`Error creating folder: ${err}`);
    //   } else {
    //     console.log(`Folder '${tempFolderName}' created successfully.`);
    //   }
    // });
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname.split(' ').join('-')}`;
    cb(null, fileName);
  }
});

const createUploader = (folderPath, limits) => {
  return multer({ storage: configureStorage(folderPath), limits: limits });
}

module.exports = createUploader;