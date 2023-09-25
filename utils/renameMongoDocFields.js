
function renameMongooseDocField(Schema, object) {
  Schema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
      Object.keys(object).map((key) => {
        if (object[key] !== undefined) {
          ret[object[key]] = ret[key];
        }
        delete ret[key];
      });
    }
  });
}

module.exports = renameMongooseDocField;