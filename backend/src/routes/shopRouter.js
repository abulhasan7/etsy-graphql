const express = require("express");
const router = express.Router();
const shopService = require("../services/shopService");

router.get("/check-availability", (req, res) => {
  shopService
    .checkAvailability(req.query.shop_name)
    .then((success) => res.json({ message: success }))
    .catch((error) => res.status(400).json({ error: error }));
});

router.get("/get", async (req, res, next) => {
  let isOwner = req.query.shopId ? false : true;
  let shopId = isOwner?req.shop_id:req.query.shopId;
  let userId = req.user_id;
  const response = await shopService
    .getDetails(shopId,isOwner,userId)
    .then((response) => res.status(200).json(response))
    .catch((error) => {
      res.status(400).json({ error: error });
    });
});

router.get("/get-user", async (req, res, next) => {
  const response = await shopService
    .getDetailsForUser(req.params.shop_id)
    .then((response) => res.status(200).json(response))
    .catch((error) => {
      res.status(400).json({ error: error });
    });
});

router.post("/register", async (req, res) => {
  try {
    const success = await shopService.register({
      ...req.body,
      user_id: req.user_id,
    });
    res.json({ message: success });
  } catch (error) {
    console.log("error is ", error);
    res.status(400).json({ error: error });
  }
});

router.post("/update", (req, res) => {
  shopService
    .update({ ...req.body, shop_id: req.shop_id })
    .then((success) => res.json({ message: success }))
    .catch((error) => res.status(400).json({ error: error }));
});

module.exports = router;
