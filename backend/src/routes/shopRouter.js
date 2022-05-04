const express = require('express');

const router = express.Router();
const { checkAuth } = require('../utils/passport');
const shopService = require('../services/shopService');

router.get('/check-availability', checkAuth, (req, res) => {
  try {
    const data = shopService.checkAvailability(req.query.shop_name);
    res.status(200).json({ message: data });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error || 'Some error occured during add favourites',
    });
  }
});

router.get('/get', checkAuth, (req, res) => {
  const isOwner = !req.query.shopId;
  const shopId = isOwner ? req.user.shopId : req.query.shopId;
  const { userId } = req.user;
  try {
    const data = shopService.getDetails({ isOwner, shopId, userId });
    res.status(200).json({ message: data });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error || 'Some error occured during add favourites',
    });
  }
});

router.post('/register', checkAuth, async (req, res) => {
  console.log(req.user.userId, req.body);
  try {
    const data = shopService.register({ ...req.body, user_id: req.user.userId });
    res.status(200).json({ message: data });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error || 'Some error occured during add favourites',
    });
  }
});

router.post('/update', checkAuth, (req, res) => {
  try {
    const data = shopService.update({ ...req.body, shop_id: req.user.shopId });
    res.status(200).json({ message: data });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error || 'Some error occured during add favourites',
    });
  }
});

module.exports = router;
