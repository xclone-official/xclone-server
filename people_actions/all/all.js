const UserModel = require("../../Models/UserModel/UserModel");

const Router = require("express").Router();

Router.get(`/`, async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    return res.status(200).send({
      msg: "All people",
      status: 1,
      allPeople: allUsers,
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal server errror",
      status: 3,
    });
  }
});

module.exports = Router;
