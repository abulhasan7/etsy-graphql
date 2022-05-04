const express = require('express');

const router = express.Router();

const { checkAuth } = require('../utils/passport');

const favouriteService = require('../services/favouriteService');

router.get('/get-all', checkAuth, async (req, res) => {
  try {
    const data = favouriteService.getAllWithUserProfile(req.user.userId);
    res.status(200).json({ message: data });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error || 'Some error occured during getting all favourites',
    });
  }
});

router.post('/add', checkAuth, async (req, res) => {
  try {
    const data = favouriteService.add({ ...req.body, user_id: req.user.userId });
    res.status(200).json({ message: data });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error || 'Some error occured during add favourites',
    });
  }
});

router.delete('/remove', checkAuth, async (req, res) => {
  try {
    const data = favouriteService.delete({ favouriteId: req.body.favourite_id });
    res.status(200).json({ message: data });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error || 'Some error occured during add favourites',
    });
  }
});

module.exports = router;
