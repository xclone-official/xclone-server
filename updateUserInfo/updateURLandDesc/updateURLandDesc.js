const UserModel = require("../../Models/UserModel/UserModel");

const Router = require("express").Router();

Router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { url, desc } = req.body;
    if (!id) {
      return res.status(200).send({
        msg: "Id is invalid",
        status: 2,
      });
    }

    const isUserExist = await UserModel.findById(id);
    if (!isUserExist) {
      return res.status(200).send({
        msg: "Id is invalid",
        status: 2,
      });
    }
    isUserExist.website = url;
    isUserExist.bio = desc;
    isUserExist.save();
    return res.status(200).send({
      msg: "Updated Successfully!",
      status: 1,
      user: isUserExist,
    });
  } catch (error) {
    return res.status(500).send({
      status: 3,
      msg: "Internal server error!",
    });
  }
});

module.exports = Router;
