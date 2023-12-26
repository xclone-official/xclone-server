const UserModel = require("../../Models/UserModel/UserModel");

const Router = require("express").Router();

Router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(200).send({
        msg: "UserId must not be empty",
        status: 2,
      });
    }
    const isUserExist = await UserModel.findById(userId);
    if (!isUserExist) {
      return res.status(200).send({
        msg: "User doesn't found.",
        status: 2,
      });
    }
    for (let i = 0; i < isUserExist.allNotifications.length; i++) {
      const element = isUserExist.allNotifications[i];
      element.isSeen = true;
    }
    await isUserExist.save();
    return res.status(200).send({
      allNotifications: "Updated allNotifications successfully",
      status: 1,
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal server error",
      status: 3,
    });
  }
});

module.exports = Router;
