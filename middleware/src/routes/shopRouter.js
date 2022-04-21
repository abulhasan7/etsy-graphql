const express = require('express');

const router = express.Router();
const shopService = require('../services/shopService');
const { checkAuth } = require('../utils/passport');

router.get('/check-availability', checkAuth, (req, res) => {
  shopService
    .checkAvailability(req.query.shop_name)
    .then((success) =>
      res.json({ message: success }))
    .catch((error) =>
      res.status(400).json({ error: error.message }));
});

router.get('/get', checkAuth, (req, res) => {
  const isOwner = !req.query.shopId;
  const shopId = isOwner ? req.shop_id : req.query.shopId;
  const { userId } = req.user;
  shopService
    .getDetails(shopId, isOwner, userId)
    .then((response) =>
      res.status(200).json(response))
    .catch((error) => {
      res.status(400).json({ error });
    });
});

router.post('/register', checkAuth, async (req, res) => {
  try {
    const success = await shopService.register({
      ...req.body,
      user_id: req.user.userId,
    });
    res.json({ message: success });
  } catch (error) {
    console.log('error is ', error);
    res.status(400).json({ error });
  }
});

router.post('/update', checkAuth, (req, res) => {
  shopService
    .update({ ...req.body, shop_id: req.user.shopId })
    .then((success) =>
      res.json({ message: success }))
    .catch((error) =>
      res.status(400).json({ error }));
});

module.exports = router;
