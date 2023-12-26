const Router = require("express").Router();
const UserModel = require("../../Models/UserModel/UserModel");
Router.put("/:userId/:email", async (req, res) => {
  try {
    const { userId, email } = req.params;
    if (!userId || !email) {
      return res.status(200).send({
        status: 2,
        msg: "UserID or email can't be empty",
      });
    }
    const isUserExist = await UserModel.findById(userId);
    if (!isUserExist) {
      return res.status(200).send({
        status: 2,
        msg: "User not found",
      });
    }

    const isemailExist = await UserModel.findOne({ email: email });
    if (isemailExist) {
      return res.status(200).send({
        status: 3,
        msg: "email already exists.",
      });
    }

    await UserModel.findByIdAndUpdate({ _id: userId }, { email: email });
    const findTheUser = await UserModel.findById(userId);
    return res.status(200).send({
      status: 1,
      msg: "email updated successfully",
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
