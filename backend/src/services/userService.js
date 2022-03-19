const { User, Country, Shop } = require("../models/index");
const bcrypt = require("bcrypt");
const jwtUtil = require("../utils/jwtUtil");
const { generateSignedUrl } = require("../utils/s3");

async function login(userDetails) {
  try {
    const dbData = await User.findOne({
      where: { email: userDetails.email },
      include: [{ model: Shop, attributes: ["shop_id", "shop_name"] }],
    });
    if (!dbData) {
      throw new Error("User not found");
    } else {
      const result = await bcrypt.compare(
        userDetails.password,
        dbData.password
      );
      if (!result) {
        throw new Error("Invalid Password");
      } else {
        let shop_id = dbData.Shop ? dbData.Shop.shop_id : null;
        dbData.setDataValue("password", null);
        let obj = {
          token: jwtUtil.generateToken(
            dbData.user_id,
            shop_id,
            dbData.fullname
          ),
          profile: dbData,
        };
        return obj;
      }
    }
  } catch (error) {
    console.error("Error occured:", error);
    throw error;
  }
}

//removing profile for now, as it's being fetched during login
async function get() {
  try {
    const [upload_s3_url, countries] = await Promise.all([
      generateSignedUrl(),
      Country.findAll(),
    ]);
    return { upload_s3_url: upload_s3_url, countries: countries };
  } catch (error) {
    console.error("Error occured:", error);
    throw error;
  }
}

function register(userDetails) {
  return new Promise((resolve, reject) => {
    bcrypt
      .hash(userDetails.password, 10)
      .then((hashedValue) => {
        return User.create({
          fullname: userDetails.fullname,
          email: userDetails.email,
          password: hashedValue,
        });
      })
      .then((createdUser) => {
        const token = jwtUtil.generateToken(createdUser.user_id);
        resolve(token);
      })
      .catch((error) => {
        console.log("error occured", error);
        switch (error.name) {
          case "SequelizeUniqueConstraintError":
            reject("User already registered");
          default:
            reject(error.name);
        }
      });
  });
}

function updateProfile(userDetails) {
  return new Promise((resolve, reject) => {
    // console.log(userDetails);
    const dob = userDetails.dob.split("-");
    let datatoUpdate = {
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
    User.update(datatoUpdate, {
      where: { user_id: userDetails.user_id },
    })
      .then((created) => {
        if (created[0] > 0) {
          resolve("User Profile updated successfully");
        } else {
          throw new Error("User not found or No Changes");
        }
      })
      .catch((error) => {
        console.log("error occured", error);
        switch (error.name) {
          case "SequelizeUniqueConstraintError":
            reject("User already registered");
          default:
            reject(error.message);
        }
      });
  });
}
module.exports = { login, get, register, updateProfile };
