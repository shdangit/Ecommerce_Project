const jwt = require("jsonwebtoken");

const signAccessToken = (user_id, role) => {
  return jwt.sign({ _id: user_id, role }, process.env.JWT_SECRETKEY, {
    expiresIn: "2d",
  });
};
const signRefreshToken = (user_id) => {
  return jwt.sign({ _id: user_id }, process.env.JWT_SECRETKEY, {
    expiresIn: "7d",
  });
};

module.exports = {
  signAccessToken,
  signRefreshToken,
};
