const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.Port || 888;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", (req, res) => {
  res.json("hleo");
});

app.listen(port, () => {
  console.log("server running success: ", +port);
});
