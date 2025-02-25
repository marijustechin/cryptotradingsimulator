const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// endpointai
const userRouter = require("./routers/user.router");

const app = express();

// Midlvares visokios
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(cookieParser());

app.use("/api/v1/users", userRouter);

module.exports = app;
