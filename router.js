const express = require("express");
const router = express();
const bcrypt = require("bcrypt");
const { Usermodel } = require("./models/user");
const { validator } = require("./validator/user_validator");
const { validationMiddleware } = require("./middleware/validator_middleware");
const jwt = require("jsonwebtoken");
const { default: jwtDecode } = require("jwt-decode");
const { upload } = require("./middleware/upload_photo");
const { jwtMiddle } = require("./middleware/jwt_middleware");

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    const data = await Usermodel.findOne({ email: email });
    if (!data) return res.status(402).json({ message: "user's not found" });
    const verify = await bcrypt.compareSync(password, data.password);
    if (!verify) return res.status(402).json({ message: "password's wrong" });
    const token = jwt.sign({ id: data.id }, process.env.JWT_SIGN);

    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ message: "success to login", token });
  } catch (er) {
    console.log(er);
    return res.status(402).json({ er });
  }
});

router.post("/register", validator, validationMiddleware, async (req, res) => {
  try {
    let body = req.body;
    body.password = bcrypt.hashSync(body.password, 10);
    const data = await Usermodel.create(body);
    const token = jwt.sign({ id: data.id }, process.env.JWT_SIGN);
    res.cookie("token", token, { httpOnly: true });
    res.json({ message: "berhasil", token, data });
  } catch (er) {
    console.log(er);
    return res.status(402).json({ er });
  }
});

router.use(jwtMiddle);

router.put("/update", upload.single("photo_profile"), async (req, res) => {
  try {
    let { name, bio, phone, email, password, photo_profile } = req.body;
    let url = null;
    const data = Usermodel.findOne({
      _id: jwtDecode(req.headers.authorization).id,
    });

    if (req.file?.path !== undefined) {
      url = req.file?.path;
    } else {
      url = data.photo_profile;
    }
    await Usermodel.updateOne(
      { _id: jwtDecode(req.headers.authorization).id },
      {
        $set: {
          name: name,
          bio: bio,
          phone: phone,
          email: email,
          password: password,
          photo_profile: url,
        },
      }
    );
    res.json({ message: "success" });
  } catch (er) {
    console.log(er);
    return res.status(442).json({ message: "fail" });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const data = await Usermodel.findOne({
      _id: jwtDecode(req.headers.authorization).id,
    });
    if (!data) return res.status(402).json({ message: "user's not found" });
    res.status(200).json({ data });
  } catch (er) {
    console.log(er);
    return res.status(402).json({ er });
  }
});
module.exports = { router };
