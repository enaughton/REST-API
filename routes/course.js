const express = require("express");
const { models } = require("../db");
const { User } = models;
const router = express.Router();
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

//get courses route
app.get(
  "/courses/",
  asyncHandler(async (req, res) => {
    const course = await Course.findAll(res.params);
    res.json({
      course
    });
  })
);
// Get course By ID
app.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    res.json({
      course
    });
  })
);

//Post Route for Courses

app.post(
  "/courses/",
  asyncHandler(async (req, res) => {
    let course;
    try {
      const course = await Course.create(req.body);
      res.location("/api/courses/:id");
      res.status(201).end();
      res.json(course);
    } catch (err) {}
  })
);

//Update/Edit Course

app.put(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (course) {
        title: req.body.title;
        description: req.body.description;
        materialsNeeded: req.body.materialsNeeded;
        estimatedTime: req.body.estimatedTime;

        await res.json(course);
        res.location("/api/courses/:id");
      } else {
        res.status(404).json({ message: "Course was not found" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
);

//Delete Course
app.delete(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      await course.destroy();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
);
module.exports = router;
