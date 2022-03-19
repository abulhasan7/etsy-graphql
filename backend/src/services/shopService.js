const { Shop,Item,User,Favourite } = require("../models/index");
const { generateSignedUrl } = require("../utils/s3");
// const {generateToken} = require("../utils/jwtUtil");

async function getDetails(shop_id,isOwner,user_id) {
  try {
    if (!shop_id) {
      throw new Error("Shop doesn't exist");
    }
    const itemsPromise = Item.findAll({
      where:{
        shop_id:shop_id
      }
    })
    const shopPromise = Shop.findOne({ where: { shop_id: shop_id },include:{model:User,attributes:["fullname","phone","profile_pic_url"]} });
    console.log("userpromise is",shopPromise);
    let allData = {};
    if(isOwner){
        const [items,shop,upload_s3_url] = await Promise.all([itemsPromise,shopPromise,generateSignedUrl()])
        allData.items = items;
        allData.shop = shop;
        allData.upload_s3_url = upload_s3_url;
    }else{
      const favouritesPromise = Favourite.findAll({attributes:{exclude:["user_id"]}, where:{user_id:user_id}});
      const [items,shop,favouritesArr] = await Promise.all([itemsPromise,shopPromise,favouritesPromise]);
      allData.items = items;
      allData.shop = shop;
      if(favouritesArr){
        let favourites = {};
        favouritesArr.forEach(favourite=> favourites[favourite.item_id]=favourite.favourite_id);
        allData.favourites = favourites;
      }
    }
    // const [items,user,upload_s3_url] = await Promise.all([itemsPromise,shop.getUser({attributes: ["phone", "fullname", "profile_pic_url"]}),generateSignedUrl()])
    //TODO should i send shop id?
    // shop.setDataValue("user_id",null);
    // if (items) {
    //   shop.setDataValue("items", items);
    // }
    // shop.setDataValue("user", user);
    // shop.setDataValue("upload_s3_url",upload_s3_url);
    // shop.setDataValue("token",generateToken(user_id,shop.getDataValue("shop_id")))
    // shop.setDataValue("shop_id",null);
    // shop.setDataValue("user_id",null);
    console.log("returning :{}",allData)
    return allData;
  } catch (error) {
    console.log("error occurred", error);
    throw error.message;
  }
}

async function getDetailsForUser(user_id) {
  try {
    const shop = await Shop.findOne({ where: { user_id: user_id } });

    const [items,user] = await Promise.all([shop.getItems(),shop.getUser({attributes: ["phone", "fullname", "profile_pic_url"]})])
    //TODO should i send shop id?
    // shop.setDataValue("user_id",null);

    shop.setDataValue("user", user);
    shop.setDataValue("shop_id",null);
    shop.setDataValue("user_id",null);
    console.log("returning :{}",shop)
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


module.exports = { getDetails,getDetailsForUser, checkAvailability, register,update };
