"use strict";

// load modules
const express = require("express");
const morgan = require("morgan");
const Sequelize = require("Sequelize");
const { models } = require("./db");
const { User, Course } = models; //database connection

//asyncHandler
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}
//Database connection
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "fsjstd-restapi.db"
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to the database successful!");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
})();

// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan("dev"));

// TODO setup your api routes here

// setup a friendly greeting for the root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to our thing"
  });
});

//get user routes
app.get(
  "/api/users",
  asyncHandler(async (req, res) => {
    const user = await User.findAll();
    res.json({
      user
    });
  })
);

//get courses route
app.get(
  "/api/courses/",
  asyncHandler(async (req, res) => {
    const course = await Course.findAll(res.params);
    res.json({
      course
    });
  })
);
// Get course By ID
app.get(
  "/api/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(res.params.id);
    res.json({
      course
    });
  })
);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// set our port
app.set("port", process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get("port"), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
