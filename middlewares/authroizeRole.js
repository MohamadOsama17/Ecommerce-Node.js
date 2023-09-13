const verifyRole = (allowedRole) => {
  return (req, res, next) => {
    const { userRoles } = req;
    if (!userRoles) {
      return res.status(401).json({
        'message': 'Unauthorized Access !',
        "success": false,
      });
    }

    const matchedRoles = allowedRole.map(e => userRoles.includes(e.code)).find(val => val === true);
    if (!matchedRoles) {
      return res.status(401).json({
        'message': 'Unauthorized Access !',
        "success": false,
      });
    }
    next();
  }
}

module.exports = verifyRole;