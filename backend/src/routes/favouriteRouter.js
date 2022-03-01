const express = require("express");
const router = express.Router();
const favouriteService = require("../services/favouriteService");

router.get("/get",async (req, res) => {
  try {
    // const success = await favouriteService.get(req.user);
    const success = await favouriteService.get({user_id:req.query.user_id});
    res.json({ message: success });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/add",async (req, res) => {
  try {
    const success = await favouriteService.add(req.body);
    res.json({ message: success });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/remove", async (req, res) => {
  try {
    const success = await favouriteService.remove(req.query.favourite_id);
    res.json({ message: success });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;