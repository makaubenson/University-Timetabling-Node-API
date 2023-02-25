//Require modules/files
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//This code sets up an event listener for the "uncaughtException" event in a Node.js process.
//An uncaught exception is an error that is thrown and not caught by any try/catch block or
//error handling middleware, and would otherwise crash the process.
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  //The process.exit(1) method is then called to shut down the process with a non-zero exit code,
  // indicating that the process was terminated due to an error.
  process.exit(1);
});

//Load Environment Configs
dotenv.config({ path: './config.env' });

//require app.js
const app = require('./app');

//Database Connection
const DB = process.env.DATABASE_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// The default behavior of the "strictQuery" option in Mongoose,
// a MongoDB object modeling tool for Node.js, will change in version 7.
//Currently, the default is set to true, which means that Mongoose
//will only query for fields that are explicitly defined in the schema.
// However, in version 7, the default will change to false, which means
// that Mongoose will query for all fields, even those that are not explicitly
// defined in the schema. To prepare for this change, you can
// set the "strictQuery" option to false by using the code "mongoose.set('strictQuery', false);".
//If you want to keep the current behavior, you can use "mongoose.set('strictQuery', true);"
//to suppress the warning.
mongoose.set('strictQuery', false);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// Run this system on port 3000
const port = process.env.PORT || 3000;

//start server
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
