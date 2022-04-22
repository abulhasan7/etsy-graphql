const express = require("express");

const router = express.Router();
const { checkAuth } = require("../utils/passport");
const { sendMessage } = require("../kafka/producer");

router.get("/check-availability", checkAuth, (req, res) => {
  sendMessage(
    process.env.SHOPS_TOPIC,
    req.query.shop_name,
    "CHECK",
    (error, data) => {
      if (data) {
        res.status(200).json({ message: data });
      } else {
        console.log("error", error);
        res.status(400).json({
          error: error || "Some error occured during regsitration",
        });
      }
    }
  );
});

router.get("/get", checkAuth, (req, res) => {
  const isOwner = !req.query.shopId;
  const shopId = isOwner ? req.user.shopId : req.query.shopId;
  const { userId } = req.user;
  sendMessage(
    process.env.SHOPS_TOPIC,
    { isOwner, shopId, userId },
    "GET",
    (error, data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        console.log("error", error);
        res.status(400).json({
          error: error || "Some error occured during get",
        });
      }
    }
  );
});

router.post("/register", checkAuth, async (req, res) => {
  console.log(req.user.userId, req.body);
  sendMessage(
    process.env.SHOPS_TOPIC,
    { ...req.body, user_id: req.user.userId },
    "REGISTER",
    (error, data) => {
      if (data) {
        res.status(200).json({ message: data });
      } else {
        console.log("error", error);
        res.status(400).json({
          error: error || "Some error occured during get",
        });
      }
    }
  );
});

router.post("/update", checkAuth, (req, res) => {
  sendMessage(
    process.env.SHOPS_TOPIC,
    { ...req.body, shop_id: req.user.shopId },
    "UPDATE",
    (error, data) => {
      if (data) {
        res.status(200).json({ message: data });
      } else {
        console.log("error", error);
        res.status(400).json({
          error: error || "Some error occured during get",
        });
      }
    }
  );
});

module.exports = router;
