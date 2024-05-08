const userRouter = require("./user.routes");
const {
  notFound,
  errorHandler,
} = require("../middleware/errorHandler.middleware");
const initRouter = (app) => {
  app.use("/api/user", userRouter);

  app.use(notFound);
  app.use(errorHandler);
};
module.exports = initRouter;
