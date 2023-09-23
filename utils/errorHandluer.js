const formatMongooseValidationErrors = (error) => {
  if (!error) return;
  const errorsList = Object.values(error.errors);
  var result = errorsList.reduce((fullError, err) => fullError + ' \n' + err.message);
  return typeof result === 'string' ? result : result.message;
}


function handleMongoError(error) {
  switch (error.code) {
    case 11000:
      const errorAt = Object.keys(error.keyPattern)[0];
      return errorAt ? `${errorAt} is already exist !` : 'Data duplicated !';
    case 12000:
      // Handle unique key constraint violation in a sharded cluster
      console.error('Sharded unique key constraint violation:', error.message);
      // You can provide a custom error message or response here
      break;
    case 121:
      // Handle snapshot too old error (for replica sets)
      console.error('Snapshot too old error:', error.message);
      // You can provide a custom error message or response here
      break;
    // Handle other MongoDB error codes as needed
    default:
      console.error('MongoDB Error:', error.message);
    // Handle other MongoDB errors
  }

}

const errorHaundler = (error, req, res, next) => {
  try {
    switch (error.name) {
      //jwt errors
      case 'Not Found':
        return res.status(404).json({
          "message": error.message,
          "success": false,
        });
      case 'TokenExpiredError':
        return res.status(401).json({
          "message": `Unauthorized, ${error.name}`,
          "success": false,
        });
      case 'JsonWebTokenError':
        return res.status(403).json({
          "message": `Forbiden, ${error.name}`,
          "success": false,
        });
      case 'NotBeforeError':
        return res.status(403).json({
          "message": `Forbiden, ${error.name}`,
          "success": false,
        });

      //mongooes validation errors
      case 'ValidationError':
        const errorMessages = formatMongooseValidationErrors(error);
        return res.status(400).json({
          'message': errorMessages,
          'success': false,
        });

      case 'MongoServerError':
        const errorMessage = handleMongoError(error)
        return res.status(400).json({
          'message': errorMessage,
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