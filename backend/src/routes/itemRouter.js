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

router.post("/add", async (req, res) => {
    try {
      const success = await itemService.addItem(req.body);
      res.json({ message: success });
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

module.exports = router