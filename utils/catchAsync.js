// this code is creating a higher-order function (HOF) that takes
// in a function fn as an argument and returns a new function that calls
//the passed-in function fn and passes it the req, res, and next arguments.
//The returned function also uses the catch() method to handle any errors that
// may be thrown by the fn function, it's useful for handling errors that may occur
//in the passed-in function fn, without having to add a try-catch block inside the fn function.

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
