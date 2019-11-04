const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");

const User = require("../models/user");

//Login
router.get("/login", (req, res) => res.render("login"));

//Register
router.get("/register", (req, res) => res.render("register"));

// Post
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Password do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } else {
    User.findOne({
      email
    })
      .then(user => {
        if (user) {
          console.log("user exists");
          errors.push({ msg: "Email is already taken" });
          res.render("register", {
            errors,
            email,
            name,
            password
          });
        } else {
          const newUser = new User({ name, email, password });
          bcrypt.genSalt(10, function(err, salt) {
            console.log(salt);
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              //Set password to hashed
              newUser.password = hash;

              // Save User
              newUser
                .save()
                .then(user => console.log("Saved"))
                .catch(err => console.log(err));
            });
          });
          res.redirect("/users/login");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
});

module.exports = router;
