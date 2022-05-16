/* eslint-disable no-underscore-dangle */
const { Item, ItemCategories, Favourite } = require('../models/index');
const { generateSignedUrl } = require('../utils/s3');

async function getAllForShop(shopId) {
  try {
    const allItems = await Item.find({
      shop_id: shopId,
    })
      .populate('shop')
      .exec();

    return allItems;
  } catch (error) {
    console.error('Error occured while getting all the Items', error);
    throw new Error(error.message);
  }
}

async function getAllExceptShop(shopId, userId) {
  try {
    const itemsPromise = shopId
      ? Item.find({
        shop: {
          $ne: shopId,
        },
      })
        .populate('shop')
        .exec()
      : Item.find().populate('shop').exec();
    const favouritesPromse = Favourite.find({
      user_id: userId,
    }).exec();
    console.log('fav', userId);
    const [items, favourites] = await Promise.all([
      itemsPromise,
      favouritesPromse,
    ]);
    console.log('favourites', favourites);
    const favouritesArr = [];
    if (favourites) {
      favourites.forEach((fav) => {
        favouritesArr.push({ itemId: fav.item, favId: fav._id });
        // favouriteObj[fav.item] = fav._id;
      });
    }
    console.log(`returning ${JSON.stringify({ items, favourites: favouritesArr })}`);
    return { items, favourites: favouritesArr };
  } catch (error) {
    console.error('Error occured while getting all the Items', error);
    throw new Error(error.message);
  }
}

async function addItem(item) {
  console.log('itempassed', item.name);
  let passedCategory = false;
  try {
    await ItemCategories.updateOne(
      {
        _id: 'categories',
      },
      {
        $addToSet: { categories: item.category },
      },
    );
    passedCategory = true;
    await Item.create({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      stock: item.stock,
      sold_count: item.sold_count || 0,
      shop: item.shop_id,
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
    await ItemCategories.updateOne(
      {
        _id: 'categories',
      },
      {
        $addToSet: { categories: item.category },
      },
    );
    const updatedItem = await Item.updateOne(
      {
        _id: item.item_id,
      },
      {
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price,
        stock: item.stock,
        item_pic_url: item.item_pic_url,
      },
    );
    if (updatedItem.modifiedCount > 0) {
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
      ItemCategories.findOne({ _id: 'categories' }, { categories: 1, _id: 0 }),
      generateSignedUrl(),
    ]);
    const returnobj = {
      categories,
      s3_upload_url: s3UploadUrl,
    };
    console.log(`returnobj is ${JSON.stringify(returnobj)}`);
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
