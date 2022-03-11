const { Shop } = require("../models/index");

async function getDetails(user_id) {
  try {
    const shop = await Shop.findOne({ where: { user_id: user_id } });
    if (!shop) {
      throw new Error("Shop doesn't exist");
    }
    const items = await shop.getItems();
    if (items) {
      shop.setDataValue("items", items);
    }
    const user = await shop.getUser();
    shop.setDataValue("user", user);
    return shop;
  } catch (error) {
    console.log("error occurred", error);
    throw error.message;
  }
}

function checkAvailability(shopName) {
  return new Promise((resolve, reject) => {
    Shop.findOne({ attributes: ["shop_name"], where: { shop_name: shopName } })
      .then((elem) => {
        if (elem) {
          reject("Shop Name Not Available");
        }
        resolve("Shop Name Available");
      })
      .catch((err) => {
        console.log("Error occurred during checkign availability", err);
        reject("Some error occured during checking availabiliy");
      });
  });
}

async function register(shop) {
  try {
    const createdShop = await Shop.create({ 
      shop_name: shop.shop_name,
      user_id: shop.user_id,
    });
    if (createdShop) {
      return `Shop ${shop.shop_name} registered successfully`;
    }
    throw Error("Some occured while registering shop");
  } catch (error) {
    console.log("Error occured while registering shop", error);
    if (error && error.errors[0].path === "user_id_UNIQUE") {
      throw new Error(`User already registered a shop`);
    } else if (error.name && error.name === "SequelizeUniqueConstraintError") {
      throw new Error(`Shop ${shop_name} already exist`);
    }

    throw new Error(error.message);
  }
}
function update(shop){
  return new Promise((resolve,reject)=>{
    Shop.update({
      shop_pic_url : shop.shop_pic_url
    },{
    where:{
      shop_id:shop.shop_id
    }}).then( response =>{
      if(response[0] >0){
        resolve(`Updated shop picture`);
      }
      reject(`Shop not found`);
    }
    ).catch(error=>{
      reject(error.message)
    })
  });

}


module.exports = { getDetails, checkAvailability, register,update };
