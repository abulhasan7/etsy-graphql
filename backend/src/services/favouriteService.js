const {
  Favourite, Item, Shop,
} = require('../models/index');

async function getAllWithUserProfile(userId) {
  try {
    const favouritesArr = await Favourite.findAll({
      attributes: {
        exclude: ['user_id'],
      },
      where: {
        user_id: userId,
      },
      include: [{ model: Item, include: [Shop] }],
    });
    const favourites = {};
    if (favouritesArr) {
      favouritesArr.forEach((favourite) => {
        favourites[favourite.item_id] = favourite;
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
    const favourite = await Favourite.create({
      user_id: user.user_id,
      item_id: user.item_id,
    });
    if (favourite) {
      return favourite.favourite_id;
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
    const success = await Favourite.destroy({
      where: {
        favourite_id: favouriteId,
      },
    });
    if (success > 0) {
      return 'Favourite deleted successfully';
    }
    throw new Error("Favourite already deleted or Doesn't exist");
  } catch (error) {
    console.error('Error occurred while removing favourite', error);
    throw new Error(error.message);
  }
}

module.exports = { getAllWithUserProfile, add, remove };
