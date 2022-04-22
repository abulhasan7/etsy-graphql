const express = require("express");

const router = express.Router();
const { sendMessage } = require("../kafka/producer");
const { checkAuth } = require("../utils/passport");

// Get all the items except the user's shop's item, basically home api
router.get("/get-all", checkAuth, async (req, res) => {
  sendMessage(
    process.env.ITEMS_TOPIC,
    { shopId: req.user.shopId, userId: req.user.userId },
    "GET-ALL-EXC-SHOP",
    (error, data) => {
      if (data) {
        res.status(200).json({ message: data });
      } else {
        console.log("error", error);
        res.status(400).json({
          error: error || "Some error occured during creating order",
        });
      }
    }
  );
});

// Get all the items for a shop, owner api
router.get("/get-all-for-shop", checkAuth, async (req, res) => {
  sendMessage(
    process.env.ITEMS_TOPIC,
    { shopId: req.user.shopId },
    "GET-ALL-FOR-SHOP",
    (error, data) => {
      if (data) {
        res.status(200).json({ message: data });
      } else {
        console.log("error", error);
        res.status(400).json({
          error: error || "Some error occured during creating order",
        });
      }
    }
  );
});

router.post("/add", checkAuth, async (req, res) => {
  console.log(req.body);
  console.log(req.user.shopId);
  sendMessage(
    process.env.ITEMS_TOPIC,
    { ...req.body, shop_id: req.user.shopId },
    "ADD",
    (error, data) => {
      if (data) {
        res.status(200).json({ message: data });
      } else {
        console.log("error", error);
        res.status(400).json({
          error: error || "Some error occured during creating order",
        });
      }
    }
  );
});

router.post("/update", checkAuth, async (req, res) => {
  sendMessage(process.env.ITEMS_TOPIC, req.body, "UPDATE", (error, data) => {
    if (data) {
      res.status(200).json({ message: data });
    } else {
      console.log("error", error);
      res.status(400).json({
        error: error || "Some error occured during creating order",
      });
    }
  });
});

// This is for when the Item Add/Edit Popup opens up for the shop owner
router.get("/additem-getparams", checkAuth, async (req, res) => {
  sendMessage(
    process.env.ITEMS_TOPIC,
    { s: "s" },
    "ADD-ITEMS-GET-PARAMS",
    (error, data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        console.log("error", error);
        res.status(400).json({
          error: error || "Some error occured during creating order",
        });
      }
    }
  );
});

module.exports = router;
