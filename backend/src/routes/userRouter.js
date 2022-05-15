const express = require('express');

const router = express.Router();
const { checkAuth } = require('../utils/passport');
const userService = require('../services/userService');

/* REGISTER USER */ // curr

router.post('/register', (req, res) => {
  try {
    const data = userService.register(req.body);
    res.status(200).json(data);
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error.message || 'Some error occured during add favourites',
    });
  }
});

/* LOGIN USER */ // done

router.post('/login', async (req, res) => {
  try {
    const data = await userService.login(req.body);
    res.status(200).json(data);
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error.message || 'Some error occured during add favourites',
    });
  }
});

/* GET USER DETAILS */

router.get('/get', checkAuth, async (req, res) => {
  try {
    const data = userService.get(req.body);
    res.status(200).json(data);
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error.message || 'Some error occured during add favourites',
    });
  }
});

/* UPDATE PROFILE */

router.put('/update', checkAuth, (req, res) => {
  try {
    const data = userService.updateProfile({ ...req.body, user_id: req.user.userId });
    res.status(200).json(data);
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      error: error.message || 'Some error occured during add favourites',
    });
  }
});

module.exports = router;
