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
  const response = await shopService
    .getDetails(req.query.shop_name)
    .catch((err) => {
      console.log("why did error");
      throw new Error(err);
    });
  res.status(200).json(response);
});

router.post("/register", async (req, res) => {
    try{
        const success = await shopService.register(req.body);
        res.json({ message: success });
    }catch(error){
        console.log("error is ",error)
        res.status(400).json({ error: error.message })
    }
});

router.post("/update", (req, res) => {
    shopService.update(req.body).then(
        success =>  res.json({ message: success })
    ).catch(
        error => res.status(400).json({ error: error })
    )
});

module.exports = router;
