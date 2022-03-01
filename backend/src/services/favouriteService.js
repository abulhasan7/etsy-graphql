const { Favourite, Item } = require("../models/index");

async function get(user) {
  try {
    const favourites = await Favourite.findAll({
      where: {
        user_id: user.user_id,
      },
      include: [Item],
    });
    if (favourites.length === 0) {
      throw new Error("No Favourites found for the user");
    }
    return favourites;
  } catch (error) {
    console.log("Error occurred while getting favourites", error);
    throw new Error(error.message);
  }
}

async function add(user) {
  try {
    const success = await Favourite.create({
      user_id: user.user_id,
      item_id: user.item_id,
    });
    if (success) {
      return "Favourite added successfully";
    }
    throw new Error("Some error occurred while adding favourite");
  } catch (error) {
    console.log("Error occurred while adding favourite", error);
    if(error.name && error.name ==='SequelizeUniqueConstraintError'){
        throw new Error(`Favourite already exists`);
    }
    throw new Error(error.message);
  }
}

async function remove(favourite_id) {
  try {
    const success = await Favourite.destroy({
      where: {
        favourite_id: favourite_id,
      },
    });
    if (success > 0) {
      return "Favourite deleted successfully";
    }
    throw new Error("Favourite already deleted or Doesn't exist");
  } catch (error) {
    console.log("Error occurred while removing favourite", error);
    throw new Error(error.message);
  }
}

module.exports = { get, add, remove };
