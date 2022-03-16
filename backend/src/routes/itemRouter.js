const express = require('express')
const router = express.Router()
const itemService = require("../services/itemService");

//Get all the items except the user's shop's item
router.get('/get-all',async (req,res) =>{
  try{
    const items = await itemService.getAllExceptShop(req.shop_id,req.user_id);
    res.json({ message: items });
  }catch(error){
    res.status(400).json({ error: error.message });  
  }
})

//Get all the items for a shop, owner api
router.get('/get-all-for-shop',async (req,res) =>{
  try{
    const success = await itemService.getAllForShop(req.shop_id);
    res.json({ message: success });
  }catch(error){
    res.status(400).json({ error: error.message });  
  }
})


router.post("/add", async (req, res) => {
    try {
      const response = await itemService.addItem({...req.body,shop_id:req.shop_id});
      res.json({ message: response });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});
  
router.post("/update", async (req, res) => {
  try {
    const success = await itemService.updateItem(req.body);
    res.json({ message: success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//This is for when the Item Add/Edit Popup opens up for the shop owner
router.get("/additem-getparams", async (req, res) => {
  try {
    const data = await itemService.additemsgetparams();
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

module.exports = router