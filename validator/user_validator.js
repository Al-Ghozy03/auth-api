const { check } = require("express-validator");
const { Usermodel } = require("../models/user");

const validator = [
  check("email")
    .isEmail()
    .custom((value) =>
      Usermodel.findOne({ email: value }).then((user) => {
        if (user) return Promise.reject("E-mail has been used");
      })
    ),
];

module.exports = { validator };
