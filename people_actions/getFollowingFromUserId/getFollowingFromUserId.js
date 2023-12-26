const UserModel = require("../../Models/UserModel/UserModel");

const Router = require("express").Router();
Router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(200).send({
        msg: "userId is empty!",
        status: 2,
      });
    }
    const isUserExist = await UserModel.findById(userId);
    if (!isUserExist) {
      return res.status(200).send({
        msg: "User is empty!",
        status: 2,
      });
    }
    let allFollowers = await Promise.all(
      isUserExist.following.map(async (e) => {
        const following = await UserModel.findById(e?.user_id);
        return following;
      })
    );
    return res.status(200).send({
      msg: "Following retrieved success",
      status: 1,
      following: allFollowers,
    });
  } catch (error) {
    return res.status(500).send({
      status: 3,
      msg: "Internal server error!",
    });
  }
});
module.exports = Router;
