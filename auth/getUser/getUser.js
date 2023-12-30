const Router = require("express").Router();
const UserModel = require("../../Models/UserModel/UserModel");
const mongoose = require("mongoose");

Router.get("/:identifier", async (req, res) => {
  try {
    let { identifier } = req.params;
    identifier = identifier && identifier.trim(); // Remove leading and trailing spaces

    // Check if the identifier looks like a valid ObjectId
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    const isObjectId = objectIdPattern.test(identifier);

    let getUser;
    if (isObjectId) {
      // If it looks like a valid ObjectId, query by _id
      getUser = await UserModel.findById(identifier);
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

    return res.status(404).send({
      status: 2,
      msg: "User with that username or _id doesn't exist",
      data: null,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send({
      status: 4,
      msg: "Server error. Please try again later.",
      error: error.message,
    });
  }
});

module.exports = Router;
