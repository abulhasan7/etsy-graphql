const express = require('express');

const router = express.Router();
const favouriteService = require('../services/favouriteService');
const { checkAuth } = require('../utils/passport');

router.get('/get-all', checkAuth, async (req, res) => {
  try {
    const success = await favouriteService.getAllWithUserProfile(req.user.userId);
    res.json({ message: success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/add', checkAuth, async (req, res) => {
  try {
    const favouriteId = await favouriteService.add({ ...req.body, user_id: req.user.userId });
    res.json({ message: favouriteId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/remove', checkAuth, async (req, res) => {
  try {
    const success = await favouriteService.remove(req.body.favourite_id);
    res.json({ message: success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
