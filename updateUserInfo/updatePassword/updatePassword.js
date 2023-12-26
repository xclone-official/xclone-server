const Router = require("express").Router();
const UserModel = require("../../Models/UserModel/UserModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

Router.put("/:userId/:password", async (req, res) => {
  try {
    const { password, userId } = req.params;
    if (!password || !userId) {
      return res.status(400).send({
        status: 2,
        msg: "Password and userId can't be blank",
      });
    }

    let findUser;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      findUser = await UserModel.findById(userId);
    } else {
      findUser = await UserModel.findOne({ email: userId });
    }

    if (!findUser) {
      return res.status(404).send({
        status: 2,
        msg: "User doesn't exist",
      });
    }

    // Hash the password before updating
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password directly with findOneAndUpdate
    const findUserAfterUpdate = await UserModel.findOneAndUpdate(
      { _id: findUser._id }, // Use the _id field for query
      { password: hashedPassword },
      { new: true } // Return the updated document
    );

    return res.status(200).send({
      status: 1,
      msg: "Password updated successfully",
      data: findUserAfterUpdate,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 5,
      msg: "Internal server error",
    });
  }
});

module.exports = Router;
