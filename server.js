const express = require("express");
const app = express();
const cors = require("cors");
const { router } = require("./router");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();

app.use(cookieParser());
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(router);

app.listen(process.env.PORT);
