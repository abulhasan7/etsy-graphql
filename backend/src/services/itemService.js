const { Op } = require("sequelize");
const { Item, Item_Category, Shop, sequelize, Favourite } = require("../models/index");
const { generateSignedUrl } = require("../utils/s3");

async function getAllForShop(shop_id) {
  try {
    let allItems;
    allItems = await Item.findAll({
      where: {
        shop_id: shop_id,
      },
    });

    return allItems;
  } catch (error) {
    console.log("Error occured while getting all the Items", error);
    throw new Error(error.message);
  }
}



async function getAllExceptShop(shop_id,user_id) {
  console.log("shop id is " + shop_id);
  try {
    let itemsPromise = Item.findAll({
      //item already has a shopid, so only getting shop name
      include: [{ model: Shop, attributes: ["shop_name"] }],
      where: {
        shop_id: {
          [Op.ne]: shop_id || "",
        },
      },
    });
    let favouritesPromse = Favourite.findAll({
      attributes: ["favourite_id","item_id"],
      where: {
        user_id:user_id
      },
    });
    const [items,favourites] =await Promise.all([itemsPromise,favouritesPromse])
    console.log(favourites)
    let favouriteObj = {}; 
    if(favourites){
      console.log(favouriteObj)
      favourites.forEach(fav=>{favouriteObj[fav.item_id] = fav.favourite_id});  
      console.log(favouriteObj)
    }
    return {items:items,favourites:favouriteObj};
  } catch (error) {
    console.log("Error occured while getting all the Items", error);
    throw new Error(error.message);
  }
}

async function addItem(item) {
  let passedCategory = false;
  try {
    const category = await Item_Category.findOrCreate({
      attributes: ["name"],
      where: { name: item.category },
    });
    passedCategory = true;
    const createdItem = await Item.create({
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
    console.log("Error occured while adding item", error);
    if (error.name && error.name === "SequelizeUniqueConstraintError") {
      if (passedCategory) {
        throw new Error(
          `Item ${item.name} under the category ${item.category} for the shop already exist`
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
    const category = await Item_Category.findOrCreate({
      attributes: ["name"],
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
        // sold_count: item.sold_count,
        // shop_id: item.shop_id,
      },
      {
        where: {
          item_id: item.item_id,
        },
      }
    );
    if (updatedItem[0] > 0) {
      return `Item ${item.name} updated successfully`;
    }
    throw new Error(
      `Either Item ${item.name} not found or the details are similar`
    );
  } catch (error) {
    console.log("Error occured while updating item", error);
    if (error.name && error.name === "SequelizeUniqueConstraintError") {
      throw new Error(
        `Item ${item.name} under the category ${item.category} for shop already exist`
      );
    }
    throw new Error(error.message);
  }
}

async function additemsgetparams() {
  try {
    const [categories, s3_upload_url] = await Promise.all([
      Item_Category.findAll(),
      generateSignedUrl(),
    ]);
    let returnobj = {
      categories: categories,
      s3_upload_url: s3_upload_url,
    };

    return returnobj;
  } catch (error) {
    console.log("Error occured while getting data", error);
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
