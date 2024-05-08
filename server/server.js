const express = require("express");
const dbConnect = require("./config/db.connect");
const initRouter = require("./routes/index.routes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 888;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect();
initRouter(app);

app.listen(port, () => {
  console.log("server running success: ", +port);
});
