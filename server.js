//Require modules/files
const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

//Load Environment Configs
dotenv.config({ path: "./config.env" });

//require app.js
const app = require("./app");

// Run this system on port 3000
const port = process.env.PORT || 3000;

//start server
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
