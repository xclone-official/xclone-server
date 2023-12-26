const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then((msg) => {
    console.log("Connected Successfully");
  })

  .catch((err) => {
    console.log("Some error occured", err);
  });
