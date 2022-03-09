var express = require("express");
var router = express.Router();
const userService = require("../services/userService");

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

/* REGISTER USER */
router.post("/register", function (req, res) {
  userService
    .register(req.body)
    .then((success) => res.status(200).json({ message: success }))
    .catch((error) =>
      res
        .status(400)
        .json({ error: error || "Some error occured during regsitration" })
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
      .json({ error: error.message || "Some error occured during login" });
  }
});

/* GET USER DETAILS */
router.get("/get", async function (req, res) {
  try {
    //TODO REMOVE STRING HARDCODED
    let userDetails = await userService.get("");
    res.status(200).json({ message: userDetails });
  } catch (error) {
    res
      .status(401)
      .json({ error: error.message || "Some error occured during login" });
  }
});

/* LOGOUT USER */
router.post("/logout", function (req, res, next) {
  //THE TOKEN SHOULD BE DELETED AT THE CLIENT END, REMOVE IT FROM THE STORAGE AND COOKIES
  res.send("respond with a resource");
});

/* UPDATE PROFILE */
router.put("/update",upload.single('profile_pic'), function (req, res) {
  userService
    .updateProfile(req.file,req.body.form)
    .then((success) => res.status(200).json({ message: success }))
    .catch((error) =>
      res
        .status(400)
        .json({ error: error || "Some error occured during update" })
    );
});

module.exports = router;
