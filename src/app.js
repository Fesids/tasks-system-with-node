const express = require("express");
// const ErrorProvider = require("./classes/ErrorProvider");
const expressRateLimit = require("express-rate-limit");
const userRoutes = require("./routes/userRoutes");
const cargoRoutes = require("./routes/cargoRoutes");
const setoresRoutes = require("./routes/setorRoutes");
const tasksRoutes = require("./routes/taskRoutes");
const expressMongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hpp = require("hpp");
const xss = require("xss-clean");
const sendError = require("./utils/sendError");
const errorController = require("./controllers/error.controller");
const cookieParser = require('cookie-parser');



const app = express();


const limiter = expressRateLimit({
  max: 10,
  windowsMs: 60 * 60 * 1000,
  message: "Muitas requisições.",
  standartHeaders: true,
  legacyHeaders: false,
});

app.use(cookieParser())
app.use(express.json({ limit: limiter }));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  next();
});

// * Segurança
app.use(helmet());
app.use(hpp());
app.use(xss());

// * Rotas
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/cargos", cargoRoutes);
app.use("/api/v1/setores", setoresRoutes);
app.use("/api/v1/tasks", tasksRoutes);


app.all("*", (req, res, next) =>
  next(sendError(404, "fail", `Unsupprted URL: ${req.originalUrl}`))
  //next
);


app.use(errorController);

module.exports = app;
