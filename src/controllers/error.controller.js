const sendError = require("../utils/sendError");


const valdationError = (err) => {
  let messages = err.message.split(",");

  const message = messages
    .map((message, index) => message.split(":").at(index === 0 ? 2 : 1))
    .join("")
    .trim();

  
  return sendError(403, "fail", message);
};

const uniqueError = (err) => {
  if (
    err.keyPattern.hasOwnProperty("username") ||
    err.keyPattern.hasOwnProperty("email")
  )
    
    return sendError(409, "fail", "This user is already in use.");

 
  return sendError(401, "fail", err.message);
};

const jsonWebTokenError = () =>
  
  sendError(404, "fail", "Authentication failed.");

const tokenExpiredError = () =>
  
  sendError(401, "fail", "Authentication has expired. Please log in again.");


module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    if (err.name === "ValidationError") err = valdationError(err);
    if (err.code === 11000) err = uniqueError(err);
    if (err.name === "JsonWebTokenError") err = jsonWebTokenError();
    if (err.name === "TokenExpiredError") err = tokenExpiredError();
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
