const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const userRouter = require("./routes/userRouter");

const app = express();

//implement CORS: allows CORS for all incoming requests to our API.
app.use(cors());

app.options("*", cors()); //all resources

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 3) ROUTES
app.use("/", userRouter);

module.exports = app;
