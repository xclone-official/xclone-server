const UserModel = require("../../Models/UserModel/UserModel");
const bcryptjs = require("bcryptjs");
const Router = require("express").Router();

Router.get("/:email/:password", async (req, res) => {
  try {
    const { password, email } = req.params;
    const isEmailExist = await UserModel.findOne({ email: email });
    if (!isEmailExist) {
      return res.status(201).send({
        msg: "Email doesn't exist",
        status: 2,
      });
    }
    if (!password) {
      return res.status(201).send({
        msg: "Password can't be empty",
        status: 3,
      });
    }
    const checkPassword = await bcryptjs.compare(
      password,
      isEmailExist.password
    );
    if (!checkPassword) {
      return res.status(200).send({
        msg: "Password doesn't matched!",
        status: 4,
      });
    } else {
      return res.status(200).send({
        msg: "Password Matched",
        status: 1,
      });
    }
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
      status: 5,
    });
  }
});

module.exports = Router;
