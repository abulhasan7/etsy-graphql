const express = require('express');

const router = express.Router();
const { checkAuth } = require('../utils/passport');
const { sendMessage } = require('../kafka/producer');

/* REGISTER USER */ // curr

router.post('/register', (req, res) => {
  sendMessage(process.env.USERS_TOPIC, req.body, 'REGISTER', (error, data) => {
    if (data) {
      res.status(200).json(data);
    } else {
      console.log('error', error);

      res.status(400).json({

        error: error || 'Some error occured during regsitration',

      });
    }
  });
});

/* LOGIN USER */ // done

router.post('/login', async (req, res) => {
  sendMessage(process.env.USERS_TOPIC, req.body, 'LOGIN', (error, data) => {
    if (data) {
      res.status(200).json(data);
    } else {
      console.log('error', error);

      res.status(400).json({

        error: error || 'Some error occured during login',

      });
    }
  });
});

/* GET USER DETAILS */

router.get('/get', checkAuth, async (req, res) => {
  sendMessage(process.env.USERS_TOPIC, req.body, 'GET', (error, data) => {
    if (data) {
      res.status(200).json(data);
    } else {
      console.log('error', error);

      res.status(400).json({

        error: error || 'Some error occured during login',

      });
    }
  });
});

/* UPDATE PROFILE */

router.put('/update', checkAuth, (req, res) => {
  sendMessage(

    process.env.USERS_TOPIC,

    { ...req.body, user_id: req.user.userId },

    'UPDATE',

    (error, data) => {
      if (data) {
        res.status(200).json({ message: data });
      } else {
        console.log('error', error);

        res.status(400).json({

          error: error || 'Some error occured during update',

        });
      }
    },

  );
});

module.exports = router;
