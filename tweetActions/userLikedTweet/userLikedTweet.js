const UserModel = require("../../Models/UserModel/UserModel");
const mongoose = require("mongoose");
const Router = require("express").Router();

Router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId) {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
      if (isValidObjectId) {
        const getTweetById = await UserModel.findById(userId);
        const allLikes = getTweetById.likedTweet;
        if (getTweetById) {
          res.status(200).send({
            status: 1,
            msg: "Tweet found successfully.",
            like: allLikes,
          });
        } else {
          res.status(200).send({
            status: 2,
            msg: "We couldn't find the specific user. Maybe the id is incorrect or the user doesn't exist.",
          });
        }
      } else {
        res.status(400).send({
          status: 3,
          msg: "Invalid tweet ID format.",
        });
      }
    } else {
      res.status(400).send({
        status: 3,
        msg: "Tweet ID can't be empty.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 4,
      msg: "Internal server error.",
    });
  }
});

module.exports = Router;
