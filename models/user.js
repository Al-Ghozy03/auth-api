const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const url =
  process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/authentication_app";
mongoose.connect(url);

const Usermodel = mongoose.model("users", {
  name: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    default: null,
  },
  phone: {
    type: Number,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo_profile: {
    type: String,
    default: null,
  },
});

module.exports = { Usermodel };
