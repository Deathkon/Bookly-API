const express = require('express');
const passport = require('passport');

const {
  login,
  verify,
  register,
} = require("../../Controller/auth/auth.controller");

const router = express.Router();

router.post('/register', register);
router.post('/verify', verify);
router.post('/login', login);


router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    // Redirect the user to a success page or the home page after successful login.
    const googleLoggedIn = {
      message: "Logged in",
    };
    // // Redirect the user to a success page or the home page after successful login.
    // res.redirect("/success");
    res.status(504).json(googleLoggedIn);
  }
);

module.exports = router;
