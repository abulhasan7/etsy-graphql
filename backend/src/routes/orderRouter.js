const express = require('express')
const router = express.Router()
const orderService = require("../services/orderService");


router.post('/create',async (req,res)=>{
    try {
        const success = await orderService.create(req.body);
        res.json({ message: success });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
})

router.get('/get',async (req,res)=>{
    try {
        const success = await orderService.get(req.query.user_id);
        res.json({ message: success });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
})

module.exports = router