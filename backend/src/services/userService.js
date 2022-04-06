/* eslint-disable no-else-return */
/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const { User, Shop } = require('../models/index');
const jwtUtil = require('../utils/jwtUtil');
const { generateSignedUrl } = require('../utils/s3');

async function login(userDetails) {
  try {
    const dbData = await User.findOne({ email: userDetails.email }, { __v: 0 }).exec();
    console.log('dbdata', dbData);
    if (!dbData) {
      throw new Error('User not found');
    } else {
      const result = await bcrypt.compare(
        userDetails.password,
        dbData.password,
      );
      if (!result) {
        throw new Error('Invalid Password');
      } else {
        const ShopData = await Shop.findOne(
          { user_id: dbData._id },
        ).exec();
        const shopId = ShopData ? ShopData._id : null;
        const obj = {
          token: jwtUtil.generateToken(
            dbData._id,
            shopId,
          ),
          profile: { fullname: dbData.fullname, email: dbData.email, user_id: dbData._id },
        };
        return obj;
      }
    }
  } catch (error) {
    console.error('Error occured:', error);
    throw error;
  }
}

// removing profile for now, as it's being fetched during login
async function get() {
  try {
    const [uploads3Url] = await Promise.all([
      generateSignedUrl(),
    ]);
    return { upload_s3_url: uploads3Url };
  } catch (error) {
    console.error('Error occured:', error);
    throw error;
  }
}

function register(userDetails) {
  return new Promise((resolve, reject) => {
    bcrypt
      .hash(userDetails.password, 10)
      .then((hashedValue) => {
        const createUser = new User({
          fullname: userDetails.fullname,
          email: userDetails.email,
          password: hashedValue,
        });
        return createUser.save();
      })
      .then((createdUser) => {
        console.log(createdUser);
        const token = jwtUtil.generateToken(createdUser._id);
        resolve(token);
      })
      .catch((error) => {
        console.log('error occured', error);
        reject(new Error('User already registered'));
      });
  });
}

function updateProfile(userDetails) {
  return new Promise((resolve, reject) => {
    const dob = userDetails.dob.split('-');
    const datatoUpdate = {
      fullname: userDetails.fullname,
      phone: userDetails.phone,
      gender: userDetails.gender,
      dob: new Date(dob[0], dob[1] - 1, dob[2]),
      about: userDetails.about,
      address_1: userDetails.address_1,
      address_2: userDetails.address_2,
      city: userDetails.city,
      country: userDetails.country,
      profile_pic_url: userDetails.profile_pic_url,
    };
    User.updateOne({ _id: userDetails.user_id }, datatoUpdate).exec()
      .then((created) => {
        console.log(created);
        if (created.modifiedCount > 0) {
          resolve('User Profile updated successfully');
        } else {
          throw new Error('User not found or No Changes');
        }
      })
      .catch((error) => {
        console.log('error occured', error);
        reject(new Error('User already registered'));
      });
  });
}
module.exports = {
  login, get, register, updateProfile,
};
