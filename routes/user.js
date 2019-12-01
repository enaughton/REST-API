"use strict";

const express = require("express");
const router = express.Router();
const { models } = require("../db");
const { User } = models;
const { check, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const auth = require("basic-auth");

const app = express();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

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
      await User.create(user);
      res.status(201).setHeader("Location", "/");
      res.end();
    } catch (err) {
      console.error(err);
      res.status(404).json({ message: "user was not found" });
    }
  })
);

module.exports = router;
