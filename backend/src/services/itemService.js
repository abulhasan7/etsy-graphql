const { Op } = require('sequelize');
const {
  Item,
  ItemCategory,
  Shop,
  Favourite,
} = require('../models/index');
const { generateSignedUrl } = require('../utils/s3');

async function getAllForShop(shopId) {
  try {
    const allItems = await Item.findAll({
      where: {
        shop_id: shopId,
      },
    });

    return allItems;
  } catch (error) {
    console.error('Error occured while getting all the Items', error);
    throw new Error(error.message);
  }
}

async function getAllExceptShop(shopId, userId) {
  try {
    const itemsPromise = Item.findAll({
      // item already has a shopid, so only getting shop name
      include: [{ model: Shop, attributes: ['shop_name', 'shop_id'] }],
      where: {
        shop_id: {
          [Op.ne]: shopId || '',
        },
      },
    });
    const favouritesPromse = Favourite.findAll({
      attributes: ['favourite_id', 'item_id'],
      where: {
        user_id: userId,
      },
    });

    const [items, favourites] = await Promise.all([
      itemsPromise,
      favouritesPromse,
    ]);
    const favouriteObj = {};
    if (favourites) {
      favourites.forEach((fav) => {
        favouriteObj[fav.item_id] = fav.favourite_id;
      });
    }
    return { items, favourites: favouriteObj };
  } catch (error) {
    console.error('Error occured while getting all the Items', error);
    throw new Error(error.message);
  }
}

async function addItem(item) {
  let passedCategory = false;
  try {
    const category = await ItemCategory.findOrCreate({
      attributes: ['name'],
      where: { name: item.category },
    });
    passedCategory = true;
    await Item.create({
      name: item.name,
      category: category[0].name,
      description: item.description,
      price: item.price,
      stock: item.stock,
      sold_count: item.sold_count || 0,
      shop_id: item.shop_id,
      item_pic_url: item.item_pic_url,
    });
    return `Item ${item.name} created successfully`;
  } catch (error) {
    console.error('Error occured while adding item', error);
    if (error.name && error.name === 'SequelizeUniqueConstraintError') {
      if (passedCategory) {
        throw new Error(
          `Item ${item.name} under the category ${item.category} for the shop already exist`,
        );
      } else {
        throw new Error(`Category already ${item.category} exists`);
      }
    }

    throw new Error(error.message);
  }
}

async function updateItem(item) {
  try {
    const category = await ItemCategory.findOrCreate({
      attributes: ['name'],
      where: { name: item.category },
    });
    const updatedItem = await Item.update(
      {
        name: item.name,
        category: category[0].name,
        description: item.description,
        price: item.price,
        stock: item.stock,
        item_pic_url: item.item_pic_url,
      },
      {
        where: {
          item_id: item.item_id,
        },
      },
    );
    if (updatedItem[0] > 0) {
      return `Item ${item.name} updated successfully`;
    }
    throw new Error(
      `Either Item ${item.name} not found or the details are similar`,
    );
  } catch (error) {
    console.error('Error occured while updating item', error);
    if (error.name && error.name === 'SequelizeUniqueConstraintError') {
      throw new Error(
        `Item ${item.name} under the category ${item.category} for shop already exist`,
      );
    }
    throw new Error(error.message);
  }
}

async function additemsgetparams() {
  try {
    const [categories, s3UploadUrl] = await Promise.all([
      ItemCategory.findAll(),
      generateSignedUrl(),
    ]);
    const returnobj = {
      categories,
      s3_upload_url: s3UploadUrl,
    };

    return returnobj;
  } catch (error) {
    console.error('Error occured while getting data', error);
    throw new Error(error.message);
  }
}
module.exports = {
  getAllForShop,
  getAllExceptShop,
  addItem,
  updateItem,
  additemsgetparams,
};
