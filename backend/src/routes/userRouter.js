var express = require("express");
var router = express.Router();
const userService = require("../services/userService");

/* REGISTER USER */
router.post("/register", function (req, res) {
  userService
    .register(req.body)
    .then((success) => res.status(200).json({ message: success }))
    .catch((error) =>
      res
        .status(400)
        .json({ message: error || "Some error occured during regsitration" })
    );
});

/* LOGIN USER */
router.post("/login", async function (req, res) {
  try {
    let token = await userService.login(req.body);
    res.status(200).json({ token: token });
  } catch (error) {
    res
      .status(401)
      .json({ message: error.message || "Some error occured during login" });
  }
});

/* LOGOUT USER */
router.post("/logout", function (req, res, next) {
  //THE TOKEN SHOULD BE DELETED AT THE CLIENT END, REMOVE IT FROM THE STORAGE AND COOKIES
  res.send("respond with a resource");
});

/* UPDATE PROFILE */
router.post("/update", function (req, res) {
  userService
    .updateProfile(req.body)
    .then((success) => res.status(200).json({ message: success }))
    .catch((error) =>
      res
        .status(400)
        .json({ message: error || "Some error occured during update" })
    );
});

module.exports = router;
