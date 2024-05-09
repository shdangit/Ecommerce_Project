const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  // headers:{authorizaqtion: Bearer token}
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const accessToken = req.headers.authorization.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_SECRETKEY, (error, decode) => {
      if (error) {
        return res.status(401).json({
          success: false,
          message: "Accesstoken invalid",
        });
      }
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Accesstoken require",
    });
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  console.log(role);
  if (role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Require role admin",
    });
  }
  next();
});

module.exports = {
  verifyAccessToken,
  isAdmin,
};
