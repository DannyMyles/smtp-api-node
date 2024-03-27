// Error handling?

const { error } = require("winston");

const errorHandler = (err, req, res, next) => {
    console.log(err.stack)
    res.status(err.status || 500);
    res.json({
      error: { 
        message: err.message
      }
    });
  }
  module.exports = errorHandler