const {
  Shop, Item, User, Favourite,
} = require('../models/index');
const { generateSignedUrl } = require('../utils/s3');
const { generateToken } = require('../utils/jwtUtil');

async function getDetails(shopId, isOwner, userId) {
  try {
    if (!shopId) {
      throw new Error("Shop doesn't exist");
    }
    const itemsPromise = Item.findAll({
      where: {
        shopId,
      },
    });
    const shopPromise = Shop.findOne({
      where: { shopId },
      include: {
        model: User,
        attributes: ['fullname', 'phone', 'profile_pic_url'],
      },
    });
    console.log('userpromise is', shopPromise);
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
    } else {
      const favouritesPromise = Favourite.findAll({
        attributes: { exclude: ['userId'] },
        where: { userId },
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
    console.log('error occurred', error);
    throw error.message;
  }
}

function checkAvailability(shopName) {
  return new Promise((resolve, reject) => {
    Shop.findOne({ attributes: ['shop_name'], where: { shop_name: shopName } })
      .then((elem) => {
        if (elem) {
          reject(new Error('Shop Name Not Available'));
        }
        resolve('Shop Name Available');
      })
      .catch((err) => {
        console.log('Error occurred during checkign availability', err);
        reject(new Error('Some error occured during checking availabiliy'));
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
      return generateToken(shop.user_id, createdShop.shop_id);
    }
    throw Error('Some occured while registering shop');
  } catch (error) {
    console.log('Error occured while registering shop', error);
    if (error && error.errors[0].path === 'user_id_UNIQUE') {
      throw new Error('User already registered a shop');
    } else if (error.name && error.name === 'SequelizeUniqueConstraintError') {
      throw new Error(`Shop ${shop.shop_name} already exist`);
    }

    throw new Error(error.message);
  }
}
function update(shop) {
  return new Promise((resolve, reject) => {
    Shop.update(
      {
        shop_pic_url: shop.shop_pic_url,
      },
      {
        where: {
          shop_id: shop.shop_id,
        },
      },
    )
      .then((response) => {
        if (response[0] > 0) {
          resolve('Updated shop picture');
        }
        reject(new Error('Shop not found'));
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
