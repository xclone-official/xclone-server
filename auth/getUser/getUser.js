const Router = require("express").Router();
const UserModel = require("../../Models/UserModel/UserModel");
const mongoose = require("mongoose");
Router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    console.log(identifier);
    // Check if the identifier is a valid ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);

    let getUser;
    if (isObjectId) {
      // If it's a valid ObjectId, query by _id
      getUser = await UserModel.findOne({ _id: identifier });
    } else {
      // If it's not a valid ObjectId, query by username
      getUser = await UserModel.findOne({ username: identifier });
    }

    if (getUser) {
      return res.status(200).send({
        status: 1,
        msg: "User retrieved successfully",
        data: getUser,
      });
    }

    return res.status(200).send({
      status: 2,
      msg: "User with that username or _id doesn't exist",
      data: null,
    });
  } catch (error) {
    res.status(500).send({
      status: 4,
      msg: "Server error. Please try again later.",
      error: error.message,
    });
  }
});

module.exports = Router;
