const { Favourite, Item,User,Shop } = require("../models/index");

async function getAllWithUserProfile(user_id) {
  try {
    const favouritePromise = Favourite.findAll({
      attributes: {
        exclude: ["user_id"],
      },
      where: {
        user_id: user_id,
      },
      include: [{model:Item,include:[Shop]}],
    });
    const profilePromise = User.findOne({
      attributes:["fullname"],
      where: { user_id: user_id },
    });
    const [profile,favouritesArr] = await Promise.all([profilePromise,favouritePromise])
    let favourites ={};
    if(favouritesArr){
      favouritesArr.forEach(favourite=> favourites[favourite.item_id]=favourite);
    }
    return {profile:profile,favourites:favourites};
  } catch (error) {
    console.log("Error occurred while getting favourites", error);
    throw new Error(error.message);
  }
}

async function add(user) {
  try {
    console.log("user is ",user);
    const favourite = await Favourite.create({
      user_id: user.user_id,
      item_id: user.item_id,
    });
    if (favourite) {
      return favourite.favourite_id;
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

module.exports = { getAllWithUserProfile, add, remove };
