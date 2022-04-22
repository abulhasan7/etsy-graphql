const express = require('express');

const router = express.Router();
const userService = require('../services/userService');
const { checkAuth } = require('../utils/passport');

/* REGISTER USER */
router.post('/register', (req, res) => {
  userService
    .register(req.body)
    .then((token) =>
      res.status(200).json({ token }))
    .catch((error) => {
      console.log('error', error);
      res
        .status(400)
        .json({ error: error.message || 'Some error occured during regsitration' });
    });
});

/* LOGIN USER */
router.post('/login', async (req, res) => {
  try {
    const loginResponse = await userService.login(req.body);

    res.status(200).json(loginResponse);
  } catch (error) {
    res
      .status(401)
      .json({ error: error.message || 'Some error occured during login' });
  }
});

/* GET USER DETAILS */
router.get('/get', checkAuth, async (req, res) => {
  try {
    console.log('req', req);
    const userDetails = await userService.get();
    res.status(200).json(userDetails);
  } catch (error) {
    res
      .status(401)
      .json({ error: error.message || 'Some error occured during getting user details' });
  }
});

/* UPDATE PROFILE */
router.put('/update', checkAuth, (req, res) => {
  userService
    .updateProfile({ ...req.body, user_id: req.user.userId })
    .then((success) =>
      res
        .status(200)
        .json({ message: success }))
    .catch((error) => {
      console.log('in router', error);
      res
        .status(400)
        .json({ error: error || 'Some error occured during updating profile' });
    });
});

module.exports = router;
