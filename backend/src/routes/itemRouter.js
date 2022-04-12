const express = require('express');

const router = express.Router();
const itemService = require('../services/itemService');
const { checkAuth } = require('../utils/passport');

// Get all the items except the user's shop's item, basically home api
router.get('/get-all', checkAuth, async (req, res) => {
  try {
    const items = await itemService.getAllExceptShop(req.user.shopId, req.user.userId);
    res.json({ message: { ...items, fullname: req.fullname } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all the items for a shop, owner api
router.get('/get-all-for-shop', checkAuth,async (req, res) => {
  try {
    const items = await itemService.getAllForShop(req.user.shopId);
    res.json({ message: items });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/add', checkAuth, async (req, res) => {
  try {
    const response = await itemService.addItem({ ...req.body, shop_id: req.user.shopId });
    res.json({ message: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/update', checkAuth, async (req, res) => {
  try {
    const success = await itemService.updateItem(req.body);
    res.json({ message: success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// This is for when the Item Add/Edit Popup opens up for the shop owner
router.get('/additem-getparams', checkAuth, async (req, res) => {
  try {
    const data = await itemService.additemsgetparams();
    res.json(data);
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
