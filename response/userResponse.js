const userResponse = (userModel) => {
  if (!userModel) return;

  return {
    username: userModel.username,
    roles: userModel.roles,
    _id: userModel._id
  };
}

module.exports = userResponse;