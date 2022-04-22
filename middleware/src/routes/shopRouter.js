const express = require('express');

const router = express.Router();
const shopService = require('../services/shopService');
const { checkAuth } = require('../utils/passport');
const { sendMessage } = require("../kafka/producer");

router.get('/check-availability', checkAuth, (req, res) => {
  sendMessage(process.env.SHOPS_TOPIC, req.query.shop_name, "CHECK", (error, data) => {
    if (data) {
      res.status(200).json({message:data});
    } else {
      console.log("error", error);
      res.status(400).json({
        error: error || "Some error occured during regsitration",
      });
    }
  });
});

router.get('/get', checkAuth, (req, res) => {
  const isOwner = !req.query.shopId;
  const shopId = isOwner ? req.user.shopId : req.query.shopId;
  const { userId } = req.user;
  console.log('rq is',req.user);
  console.log('che',JSON.stringify({isOwner,shopId,userId}));
  sendMessage(process.env.SHOPS_TOPIC, {isOwner,shopId,userId}, "GET", (error, data) => {
    if (data) {
      res.status(200).json(data);
    } else {
      console.log("error", error);
      res.status(400).json({
        error: error || "Some error occured during get",
      });
    }
  });
});

router.post('/register', checkAuth, async (req, res) => {
  // try {
    console.log(req.user.userId,req.body);
    sendMessage(process.env.SHOPS_TOPIC, {...req.body,user_id:req.user.userId}, "REGISTER", (error, data) => {
      if (data) {
        res.status(200).json({message:data});
      } else {
        console.log("error", error);
        res.status(400).json({
          error: error || "Some error occured during get",
        });
      }
    });

  //   const success = await shopService.register({
  //     ...req.body,
  //     user_id: req.user.userId,
  //   });
  //   res.json({ message: success });
  // } catch (error) {
  //   console.log('error is ', error);
  //   res.status(400).json({ error });
  // }
});

router.post('/update', checkAuth, (req, res) => {

  sendMessage(process.env.SHOPS_TOPIC, { ...req.body, shop_id: req.user.shopId }, "UPDATE", (error, data) => {
    if (data) {
      res.status(200).json({message:data});
    } else {
      console.log("error", error);
      res.status(400).json({
        error: error || "Some error occured during get",
      });
    }
  });

  // shopService
  //   .update({ ...req.body, shop_id: req.user.shopId })
  //   .then((success) =>
  //     res.json({ message: success }))
  //   .catch((error) =>
  //     res.status(400).json({ error }));
});

module.exports = router;
