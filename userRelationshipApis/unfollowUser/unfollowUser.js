const UserModel = require("../../Models/UserModel/UserModel");
const Router = require("express").Router();

Router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // other user id
    const { id } = req.body; //myid

    if (!userId || !id) {
      return res.status(400).send({
        status: 0,
        msg: "UserId and ID can't be empty.",
      });
    }

    // Check if the user to be unfollowed (userId) exists
    const userToUnfollow = await UserModel.findById(userId); //other user

    if (!userToUnfollow) {
      return res.status(404).send({
        status: 0,
        msg: "User to unfollow not found.",
      });
    }

    // Check if the user who wants to unfollow (id) exists
    const userUnfollowing = await UserModel.findById(id); //Me

    if (!userUnfollowing) {
      return res.status(404).send({
        status: 0,
        msg: "User unfollowing not found.",
      });
    }

    // Remove the userToUnfollow from the following list of userUnfollowing
    // Me
    userUnfollowing.following = userUnfollowing.following.filter(
      (user) => user.user_id !== userId
    );
    await userUnfollowing.save();

    // Other
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (user) => user.user_id !== id
    );
    await userToUnfollow.save();

    res.status(200).send({
      status: 1,
      msg: "Account unfollowed successfully.",
      userToUnfollow: userToUnfollow,
      userUnfollowing: userUnfollowing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 3,
      msg: "Internal server error",
    });
  }
});

module.exports = Router;
