// This code defines a custom error class called AppError which extends
//the built-in JavaScript Error class.

class AppError extends Error {
  constructor(message, statusCode) {
    //. The message argument is passed to the parent class' constructor function
    // using the super() method. This allows the AppError class to have the
    //same message property as the built-in Error class.
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // Sets the isOperational property to true to indicate that this is a operational error
    //and not a programming error.
    this.isOperational = true;

    // , a stack trace is a record of the call stack at a certain point in time,
    //it's a list of the functions that were called in order to reach a certain point in the code,
    //each entry in a stack trace includes the function name, the file name, and the line number of
    //the function call. This information can be used to quickly identify the location of the error
    //in the code and understand the code flow that led to the error.
    //capture the stack trace using the Error.captureStackTrace()
    Error.captureStackTrace(this, this.constructor);
  }
}

// exports the AppError class so that it can be imported and used in other parts of the application.
module.exports = AppError;
