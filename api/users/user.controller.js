const User = require("./user.model.js");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
  getUsers: (req, res, next) => {
    User.find()
      .then((users) => {
        res.send({ success: 1, data: users });
      })
      .catch((err) => {
        res.status(500).send({
          success: 0,
          message:
            err.message || "Something went wrong while fetching all users.",
        });
      });
  },

  createUser: (req, res, next) => {
    const body = req.body;

    if (0 === Object.keys(body).length) {
      return res.status(400).send({
        success: 0,
        message: "Please fill all the required fields",
      });
    }
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    const user = new User({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone,
      password_encrypted: body.password,
    });
    user
      .save()
      .then((data) => {
        res.send({ success: 1, data: data });
      })
      .catch((err) => {
        res.status(500).send({
          success: 0,
          message:
            err.message || "Something went wrong while creating new user.",
        });
      });
  },

  getUserById: (req, res, next) => {
    User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            success: 0,
            message: "User not found with id " + req.params.id,
          });
        }
        res.send({ success: 1, data: user });
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            success: 0,
            message: "User not found with id " + req.params.id,
          });
        }
        return res.status(500).send({
          success: 0,
          message: "Error getting user with id " + req.params.id,
        });
      });
  },

  updateUser: (req, res, next) => {
    const body = req.body;

    if (0 === Object.keys(body).length) {
      return res.status(400).send({
        success: 0,
        message: "Please fill all required field",
      });
    }
    User.findByIdAndUpdate(
      req.params.id,
      {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone,
      },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            success: 0,
            message: "user not found with id " + req.params.id,
          });
        }
        res.send({ success: 1, data: user });
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            success: 0,
            message: "user not found with id " + req.params.id,
          });
        }
        return res.status(500).send({
          success: 0,
          message: "Error updating user with id " + req.params.id,
        });
      });
  },

  deleteUser: (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            success: 0,
            message: "user not found with id " + req.params.id,
          });
        }
        res.send({ success: 1, data: "user deleted successfully!" });
      })
      .catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            success: 0,
            message: "user not found with id " + req.params.id,
          });
        }
        return res.status(500).send({
          success: 0,
          message: "Could not delete user with id " + req.params.id,
        });
      });
  },

  login: (req, res, next) => {
    const body = req.body;
    User.find({ email: body.email })
      .then((user) => {
        user = user[0];
        const result = compareSync(body.password, user.password_encrypted);
        if (!result) {
          return res.json({
            success: 0,
            message: "Invalid email or password",
          });
        }
        user.password_encrypted = undefined;
        const jsontoken = sign({ result: user }, process.env.JWT_KEY, {
          expiresIn: "1h",
        });
        return res.json({
          success: 1,
          message: "login successfully",
          token: jsontoken,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(404).send({
          success: 0,
          message: "user not found with email " + body.email,
        });
      });
  },
};
