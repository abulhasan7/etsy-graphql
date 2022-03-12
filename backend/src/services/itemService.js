const { Item, Item_Category, Shop } = require("../models/index");
const { generateSignedUrl } = require("../utils/s3");

async function getAll(shop_id) {
  try {
    let allItems;
    if (shop_id) {
      allItems = await Item.findAll({
        include: [Shop],
        where: {
          shop_id: shop_id,
        },
      });
    } else {
      allItems = await Item.findAll({
        include: [Shop],
      });
    }

    console.log(JSON.stringify(allItems));

    return allItems;
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
    });
    return `Item ${item.name} created successfully`;
  } catch (error) {
    console.log("Error occured while adding item", error);
    if (error.name && error.name === "SequelizeUniqueConstraintError") {
      if(passedCategory){
        throw new Error(
          `Item ${item.name} under the category ${item.category} for the shop already exist`
        );
      }else{
        throw new Error(
          `Category already ${item.category} exists`
        );
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
module.exports = { getAll, addItem, updateItem, additemsgetparams };
