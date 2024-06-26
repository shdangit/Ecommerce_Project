const userRouter = require("./user.routes");
const adminRouter = require("./admin.routes");
const productRouter = require("./product.routes");
const categoryRouter = require("./category.routes");
const blogCategoryRouter = require("./blogCategory.routes");
const blogRouter = require("./blog.routes");
const brandRouter = require("./brand.routes");
const couponRouter = require("./coupon.routes");
const orderRouter = require("./order.routes");
const insertDataRouter = require("./insertData.routes");

const {
  notFound,
  errorHandler,
} = require("../middleware/errorHandler.middleware");

const initRouter = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/product", productRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/blogcategory", blogCategoryRouter);
  app.use("/api/brand", brandRouter);
  app.use("/api/coupon", couponRouter);
  app.use("/api/order", orderRouter);
  app.use("/api/insertData", insertDataRouter);

  app.use(notFound);
  app.use(errorHandler);
};
module.exports = initRouter;
