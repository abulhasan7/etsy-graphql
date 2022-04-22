/* eslint-disable no-underscore-dangle */
const { Shop, Item, Favourite, mongoose } = require("../models/index");
const { generateSignedUrl } = require("../utils/s3");
const { generateToken } = require("../utils/jwtUtil");

async function getDetails(shopId, isOwner, userId) {
  try {
    if (!shopId) {
      throw new Error("Shop doesn't exist");
    }
    const itemsPromise = Item.find({
      shop_id: shopId,
    }).exec();
    const shopPromise = Shop.findOne({ _id: shopId }).populate("user");
    const allData = {};
    if (isOwner) {
      const [items, shop, uploadS3Url] = await Promise.all([
        itemsPromise,
        shopPromise,
        generateSignedUrl(),
      ]);
      allData.items = items;
      allData.shop = shop;
      allData.upload_s3_url = uploadS3Url;
      if (!shop) {
        throw new Error("Shop doesn't exist");
      }
    } else {
      const favouritesPromise = Favourite.find({
        user_id: userId,
      });
      const [items, shop, favouritesArr] = await Promise.all([
        itemsPromise,
        shopPromise,
        favouritesPromise,
      ]);
      allData.items = items;
      allData.shop = shop;
      if (favouritesArr) {
        const favourites = {};
        favouritesArr.forEach((favourite) => {
          favourites[favourite.item_id] = favourite.favourite_id;
        });
        allData.favourites = favourites;
      }
    }
    return allData;
  } catch (error) {
    console.error("error occurred", error);
    throw error;
  }
}

function checkAvailability(shopName) {
  return new Promise((resolve, reject) => {
    Shop.findOne({ shop_name: shopName })
      .exec()
      .then((elem) => {
        console.log(elem);
        if (elem) {
          reject(new Error("Shop Name Not Available"));
        }
        resolve("Shop Name Available");
      })
      .catch((err) => {
        console.error("Error occurred during checkign availability", err);
        reject(new Error("Some error occured during checking availabiliy"));
      });
  });
}

async function register(shop) {
  try {
    const createShop = new Shop({
      _id: new mongoose.Types.ObjectId(),
      shop_name: shop.shop_name,
      user: shop.user_id,
    });
    const createdShop = await createShop.save();
    console.log("created", createdShop);
    if (createdShop) {
      return generateToken(shop.user_id, createdShop._id);
    }
    throw Error("Some occured while registering shop");
  } catch (error) {
    console.error("Error occured while registering shop", error);
    console.error(error);
    if (error && error.message.includes("shop_name_1")) {
      throw new Error(`Shop ${shop.shop_name} already exist`);
      throw new Error("User already registered a shop");
    } else if (error && error.message.includes("user_1")) {
      throw new Error("User already registered a shop");
    }
    throw new Error(error.message);
  }
}
function update(shop) {
  return new Promise((resolve, reject) => {
    Shop.updateOne(
      {
        _id: shop.shop_id,
      },
      {
        shop_pic_url: shop.shop_pic_url,
      }
    )
      .then((response) => {
        console.log(response);
        if (response.modifiedCount > 0) {
          resolve("Updated shop picture");
        } else {
          reject(new Error("Shop not found"));
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

module.exports = {
  getDetails,
  checkAvailability,
  register,
  update,
};
