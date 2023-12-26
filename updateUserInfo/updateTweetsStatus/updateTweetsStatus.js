const Router = require("express").Router();
const UserModel = require("../../Models/UserModel/UserModel");
Router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(200).send({
        status: 2,
        msg: "UserID or protected_posts can't be empty",
      });
    }
    const isUserExist = await UserModel.findById(userId);
    if (!isUserExist) {
      return res.status(200).send({
        status: 2,
        msg: "User not found",
      });
    }
    const getStatus = await isUserExist.protected_posts;
    await UserModel.findByIdAndUpdate(
      { _id: userId },
      { protected_posts: !getStatus }
    );
    const findTheUser = await UserModel.findById(userId);
    return res.status(200).send({
      status: 1,
      msg: "phone updated successfully",
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
