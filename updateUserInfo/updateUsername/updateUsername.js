const Router = require("express").Router();
const UserModel = require("../../Models/UserModel/UserModel");
Router.put("/:userId/:userName", async (req, res) => {
  try {
    const { userId, userName } = req.params;
    if (!userId || !userName) {
      return res.status(200).send({
        status: 2,
        msg: "UserID or Username can't be empty",
      });
    }
    const isUserExist = await UserModel.findById(userId);
    if (!isUserExist) {
      return res.status(200).send({
        status: 2,
        msg: "User not found",
      });
    }

    const isUserNameExist = await UserModel.findOne({ username: userName });
    if (isUserNameExist) {
      return res.status(200).send({
        status: 3,
        msg: "Username already exists.",
      });
    }

    await UserModel.findByIdAndUpdate({ _id: userId }, { username: userName });
    const findTheUser = await UserModel.findById(userId);
    return res.status(200).send({
      status: 1,
      msg: "Username updated successfully",
      user: findTheUser,
    });
  } catch (error) {
    res.status(500).send({
      status: 4,
      msg: "Internal server error",
    });
  }
});

module.exports = Router;
