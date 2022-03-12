const express = require('express')
const router = express.Router()
const itemService = require("../services/itemService");

router.get('/get-all',async (req,res) =>{
  try{
    const success = await itemService.getAll();
    res.json({ message: success });
  }catch(error){
    res.status(400).json({ error: error.message });  
  }
})

router.get('/get-all-by-shop',async (req,res) =>{
  try{
    const success = await itemService.getAll(req.shop_id);
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

router.get("/additem-getparams", async (req, res) => {
  try {
    const data = await itemService.additemsgetparams();
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

module.exports = router