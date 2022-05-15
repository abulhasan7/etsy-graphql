const express = require('express');

const router = express.Router();
const { checkAuth } = require('../utils/passport');
const itemService = require('../services/itemService');

// Get all the items except the user's shop's item, basically home api
router.get('/get-all', checkAuth, async (req, res) => {
  try {
    const data = itemService.getAllExceptShop({ shopId: req.user.shopId, userId: req.user.userId });
    res.status(200).json(data);
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error.message || 'Some error occured during add favourites',
    });
  }
});

// Get all the items for a shop, owner api
router.get('/get-all-for-shop', checkAuth, async (req, res) => {
  try {
    const data = itemService.getAllForShop({ shopId: req.user.shopId });
    res.status(200).json(data);
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error.message || 'Some error occured during add favourites',
    });
  }
});

router.post('/add', checkAuth, async (req, res) => {
  try {
    const data = itemService.addItem({ ...req.body, shop_id: req.user.shopId });
    res.status(200).json(data);
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error.message || 'Some error occured during add favourites',
    });
  }
});

router.post('/update', checkAuth, async (req, res) => {
  try {
    const data = itemService.updateItem(req.body);
    res.status(200).json(data);
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error.message || 'Some error occured during add favourites',
    });
  }
});

// This is for when the Item Add/Edit Popup opens up for the shop owner
router.get('/additem-getparams', checkAuth, async (req, res) => {
  try {
    const data = itemService.additemsgetparams();
    res.status(200).json(data);
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error.message || 'Some error occured during add favourites',
    });
  }
});

module.exports = router;
