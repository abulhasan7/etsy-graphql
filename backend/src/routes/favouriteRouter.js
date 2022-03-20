const express = require('express');

const router = express.Router();
const favouriteService = require('../services/favouriteService');

router.get('/get-all', async (req, res) => {
  try {
    const success = await favouriteService.getAllWithUserProfile(req.user_id);
    res.json({ message: success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/check-favourite', async (req, res) => {
  try {
    const success = await favouriteService.isFavourite(req.user_id, req.query.item_id);
    res.json({ message: success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const favouriteId = await favouriteService.add({ ...req.body, user_id: req.user_id });
    res.json({ message: favouriteId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/remove', async (req, res) => {
  try {
    const success = await favouriteService.remove(req.body.favourite_id);
    res.json({ message: success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
