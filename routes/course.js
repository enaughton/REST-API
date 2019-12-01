/*
!!!!!!!!!!
Not using the Routes Folder. 
ALL ROUTES ARE IN App.js
!!!!!!!!!!


*/

const express = require("express");

const { Course } = require("../db/models/course");

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
  "/courses",
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
  "/courses/:id",
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
  "/courses/",
  asyncHandler(async (req, res) => {
    let course;
    try {
      const course = await Course.create(req.body);
      await res.json(course);
      res.location("/courses/:id");
    } catch (err) {}
  })
);

//Update/Edit Course

app.put(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (!course)
        res
          .status(404)
          .json({ message: "This course with this id is not found" });
      course.update(req.body);

      await res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: error.message });
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
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
);
module.exports = router;
