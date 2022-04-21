const express = require('express');

const router = express.Router();
const orderService = require('../services/orderService');
const { checkAuth } = require('../utils/passport');

router.post('/create', checkAuth, async (req, res) => {
  try {
    const success = await orderService.create({ ...req.body, user_id: req.user.userId });
    res.json({ message: success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/get', checkAuth, async (req, res) => {
  try {
    const success = await orderService.get(req.user.userId);
    res.json({ message: success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
