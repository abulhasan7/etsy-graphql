const express = require('express');

const router = express.Router();
const { checkAuth } = require('../utils/passport');
const orderService = require('../services/orderService');

// TODO test after items
router.post('/create', checkAuth, async (req, res) => {
  try {
    const data = orderService.create({ ...req.body, user_id: req.user.userId });
    res.status(200).json(data);
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error.message || 'Some error occured during add favourites',
    });
  }
});

router.get('/get', checkAuth, async (req, res) => {
  try {
    const data = orderService.get({ userId: req.user.userId });
    res.status(200).json(data);
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error.message || 'Some error occured during add favourites',
    });
  }
});

module.exports = router;
