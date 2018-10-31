const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const Advertiser = require("../../models/Advertiser");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public

router.get("/test", (req, res) => res.json({ msg: "users works" }));

router.get("/", (req, res) => res.json({ msg: "gets all users" }));

// @route   GET api/users/register
// @desc    Tests users route
// @access  Public

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Advertiser.findOne({ email: req.body.email }).then(advertiser => {
    if (advertiser) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      // const avatar = gravatar.url(req.body.email, {
      //   s: "200", // Size
      //   r: "pg", // Rating
      //   d: "mm" // Default
      // });
      const newAdvertiser = new Advertiser({
        name: req.body.name,
        email: req.body.email,
        company: req.body.company,
        companyId: req.body.companyId,
        password: req.body.password,
        role: req.body.role,
        status: req.body.status
      });

      // this user is what is returned from save
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdvertiser.password, salt, (err, hash) => {
          if (err) throw err;
          newAdvertiser.password = hash;
          newAdvertiser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / return jwt token
// @access  Public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  Advertiser.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = {
          id: user.id,
          role: user.role,
          name: user.name,
          avatar: user.avatar
        }; // Create JWT Payload
        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              role: user.role
            });
            // Bearer us a special thing for header
          }
        );
        // res.json({ msg: "Success" });
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });

    // res.json({ msg: "Success" });
  }
);

router.get("/thumbsxx", (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(404).json({ nousersfound: "No posts found" }));
});

const names = ["Jake", "Jon", "Thruster"];

router.get("/thumbs", (req, res) => res.json(names));

module.exports = router;
