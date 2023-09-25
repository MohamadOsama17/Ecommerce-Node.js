
function renameMongooseDocField(Schema, fieldsMaperObject) {
  Schema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
      Object.keys(fieldsMaperObject).map((key) => {
        if (fieldsMaperObject[key] !== undefined) {
          ret[fieldsMaperObject[key]] = ret[key];
        }
        delete ret[key];
      });
    }
  });
}

module.exports = renameMongooseDocField;