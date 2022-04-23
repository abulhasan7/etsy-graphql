const express = require('express');

const router = express.Router();
const { checkAuth } = require('../utils/passport');
const { sendMessage } = require('../kafka/producer');
// TODO test after items
router.post('/create', checkAuth, async (req, res) => {
  sendMessage(
    process.env.ORDERS_TOPIC,
    { ...req.body, user_id: req.user.userId },
    'CREATE',
    (error, data) => {
      if (data) {
        res.status(200).json({ message: data });
      } else {
        console.log('error', error);
        res.status(400).json({
          error: error || 'Some error occured during creating order',
        });
      }
    },
  );
});

router.get('/get', checkAuth, async (req, res) => {
  sendMessage(
    process.env.ORDERS_TOPIC,
    { userId: req.user.userId },
    'GET',
    (error, data) => {
      if (data) {
        res.status(200).json({ message: data });
      } else {
        console.log('error', error);
        res.status(400).json({
          error: error || 'Some error occured during creating order',
        });
      }
    },
  );
});

module.exports = router;
