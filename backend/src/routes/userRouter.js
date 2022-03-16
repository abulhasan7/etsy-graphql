var express = require("express");
var router = express.Router();
const userService = require("../services/userService");

/* REGISTER USER */
router.post("/register", function (req, res) {
  userService
    .register(req.body)
    .then((token) => res.status(200).json({ token: token }))
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
    let userDetails = await userService.get(req.user_id);
    res.status(200).json(userDetails);
  } catch (error) {
    res
      .status(401)
      .json({ error: error.message || "Some error occured during login" });
  }
});

/* UPDATE PROFILE */
router.put("/update", function (req, res) {
  userService
    .updateProfile({ ...req.body, user_id: req.user_id })
    .then((success) => res.status(200).json({ message: success }))
    .catch((error) => {
      console.log(error);
      res
        .status(400)
        .json({ error: error || "Some error occured during update" });
    });
});

module.exports = router;
