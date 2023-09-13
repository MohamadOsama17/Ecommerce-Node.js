const formatMongooseValidationErrors = (error) => {
  if (!error) return;
  const errorsList = Object.values(error.errors);
  var result = errorsList.reduce((fullError, err) => fullError + ' \n' + err.message);
  return typeof result === 'string' ? result : result.message;
}

const errorHaundler = (error, req, res, next) => {
  try {
    switch (error.name) {
      //jwt errors
      case 'TokenExpiredError':
        return res.status(403).json({
          "message": `Forbiden, ${error.name}`,
          "success": false,
        });
      case 'JsonWebTokenError':
        return res.status(401).json({
          "message": `Unauthorized, ${error.name}`,
          "success": false,
        });
      case 'NotBeforeError':
        return res.status(401).json({
          "message": `Unauthorized, ${error.name}`,
          "success": false,
        });

      //mongooes validation errors
      case 'ValidationError':
        const errorMessages = formatMongooseValidationErrors(error);
        return res.status(400).json({
          'message': errorMessages,
          'success': false,
        })

      default:
        return res.status(500).json({
          "message": `Internal Server Error :${error.message}, error name : ${error.name}`,
          "success": false,
        });
    }
  } catch (error) {
    return res.status(500).json({
      "message": `Internal Server Error :${error.message}, error name : ${error.name}`,
      "success": false,
    });
  }

}

module.exports = errorHaundler;