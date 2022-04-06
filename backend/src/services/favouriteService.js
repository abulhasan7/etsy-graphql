/* eslint-disable no-underscore-dangle */
const {
  Favourite,
} = require('../models/index');

async function getAllWithUserProfile(userId) {
  try {
    const favouritesArr = await Favourite.find({
      user_id: userId,
    }).populate('item').exec();
    const favourites = {};
    if (favouritesArr) {
      favouritesArr.forEach((favourite) => {
        favourites[favourite.item._id] = favourite;
      });
    }
    return { favourites };
  } catch (error) {
    console.error('Error occurred while getting favourites', error);
    throw new Error(error.message);
  }
}

async function add(user) {
  try {
    const createFavourite = new Favourite({
      user_id: user.user_id,
      item: user.item_id,
    });
    const favourite = await createFavourite.save();
    console.log(favourite);
    if (favourite) {
      return favourite._id;
    }
    throw new Error('Some error occurred while adding favourite');
  } catch (error) {
    console.error('Error occurred while adding favourite', error);
    if (error.name && error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('Favourite already exists');
    }
    throw new Error(error.message);
  }
}

async function remove(favouriteId) {
  try {
    const success = await Favourite.deleteOne({
      _id: favouriteId,
    });
    if (success.deletedCount > 0) {
      return 'Favourite deleted successfully';
    }
    throw new Error("Favourite already deleted or Doesn't exist");
  } catch (error) {
    console.error('Error occurred while removing favourite', error);
    throw new Error(error.message);
  }
}

module.exports = { getAllWithUserProfile, add, remove };
