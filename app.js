"use strict";

// load modules
const express = require("express");
const morgan = require("morgan");
//const user = require("./routes/user"); // Route file
//const course = require("./routes/course");
const Sequelize = require("Sequelize");
const { models } = require("./db");
const { User, Course } = models; //database connection

const auth = require("basic-auth");
const bcryptjs = require("bcryptjs");

asyncHandler;
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
app.use(express.json());

// TODO setup your api routes here

// setup a friendly greeting for the root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to our thing"
  });
});

asyncHandler;
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}

const authenticateUser = asyncHandler(async (req, res, next) => {
  let message = null;

  const credentials = auth(req);

  if (credentials) {
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name
      }
    });

    if (user) {
      const authenticated = bcryptjs.compareSync(
        credentials.pass,
        user.password
      );
      if (authenticated) {
        console.log(
          `Authentication successful for username: ${user.emailAddress}`
        );

        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Auth Header not found";
  }
  if (message) {
    console.warn(message);
    res.status(401).json({ message: "Access Denied" });
  } else {
    next();
  }
});

//get user routes
app.get("/api/users", authenticateUser, (req, res) => {
  const user = req.currentUser;
  res.status(200).json({
    emailAddress: user.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName
  });
});

//create user

app.post(
  "/api/users",
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const user = req.body;

    try {
      if (user.password) {
        user.password = bcryptjs.hashSync(user.password, 10);
      }
      console.log(user.password);
      await User.create(user);
      res
        .status(201)
        .location("/")
        .end();
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  })
);

//get courses route
app.get(
  "/api/courses",
  asyncHandler(async (req, res) => {
    const course = await Course.findAll({
      include: [{ model: User, as: "user" }]
    });
    res.json({
      course
    });
  })
);
// Get course By ID
app.get(
  "/api/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      include: [{ model: User, as: "user" }]
    });
    res.json({
      course
    });
  })
);

//Post Route for Courses

app.post(
  "/api/courses/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    let course;
    try {
      const course = await Course.create(req.body);
      res
        .status(201)
        .location("api/courses/:id")
        .end();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  })
);

//Update/Edit Course

app.put(
  "/api/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);

      if (req.body.title && req.body.description) {
        course.update(req.body);
        await res.status(204).end();
      } else {
        res
          .status(400)
          .json({ message: "Please enter a Title and/or Description" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  })
);

//Delete Course
app.delete(
  "/api/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      await course.destroy();
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
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
