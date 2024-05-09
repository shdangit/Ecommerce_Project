const express = require("express");
const dbConnect = require("./config/db.connect");
const initRouter = require("./routes/index.routes");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
app.use(cookieParser());

const port = process.env.PORT || 888;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect();
initRouter(app);

app.listen(port, () => {
  console.log("server running success: ", +port);
});
