const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;


//SIGNUP

router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),

    body("name", "enter your name").isLength({ min: 3 }),
    body("password", "enter password").isLength({ min: 8 }),
  ],

  async (req, res) => {
    //if there are error it will mar the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether the user exists with same email
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({
            success: false,
            error: "sorry a user with this email already exists",
          });
      } else {
        // create a new user
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        //without salt
        user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPass, //without salt it was req.body.password
        });
      } //this will create a user, now the code to provide jwt token begins

      const data = {
        // create a data object to send it throught jwt
        user: {
          userId: user.id, //now the value that remains unique is user.id or id that was provided by the mongodb
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      // console.log(authToken)
      // .then(user => res.json(user)).catch(err=> {console.log(err)
      // res.json({error:"please enter a unique", message : err.message})})
      // console.log(req.body);
      // const user = User(req.body);
      // user.save(); 
      // res.json(user);
      res.json({ success: true, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),

    body("password", "enter password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(410)
          .json({
            error: "Try to login with correct credentials",
            success: false,
          });
      } else {
        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) {
          return res
            .status(410)
            .json({
              success: false,
              error: "Try to login with correct credentials",
            });
        } else {
          const data = {
            user: {
              userId: user.id,
            },
          };
          const authToken = jwt.sign(data, JWT_SECRET);
          res.json({ authToken, success: true });
        }
      }
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
);

router.post("/auth", fetchuser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(401).send("some error occured");
  }
});

module.exports = router;
