const Router = require("express").Router();
const UserModel = require("../../Models/UserModel/UserModel");
Router.put("/:userId/:gender", async (req, res) => {
  try {
    const { userId, gender } = req.params;
    if (!userId || !gender) {
      return res.status(200).send({
        status: 2,
        msg: "UserID or gender can't be empty",
      });
    }
    const isUserExist = await UserModel.findById(userId);
    if (!isUserExist) {
      return res.status(200).send({
        status: 2,
        msg: "User not found",
      });
    }
    await UserModel.findByIdAndUpdate({ _id: userId }, { gender: gender });
    const findTheUser = await UserModel.findById(userId);
    return res.status(200).send({
      status: 1,
      msg: "gender updated successfully",
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
