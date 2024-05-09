const userRouter = require("./user.routes");
const adminRouter = require("./admin.routes");
const {
  notFound,
  errorHandler,
} = require("../middleware/errorHandler.middleware");
const initRouter = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/admin", adminRouter);

  app.use(notFound);
  app.use(errorHandler);
};
module.exports = initRouter;
