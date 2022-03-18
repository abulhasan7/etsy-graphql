const { User, Country, Shop } = require("../models/index");
const bcrypt = require("bcrypt");
const jwtUtil = require("../utils/jwtUtil");
const { generateSignedUrl } = require("../utils/s3");

async function login(userDetails) {
  try {
    const dbUser = await User.findOne({
      attributes: ["user_id", "email", "password","fullname"],
      where: { email: userDetails.email },
      include: [{ model: Shop, attributes: ["shop_id","shop_name"] }],
    });
    if (!dbUser) {
      throw new Error("User not found");
    } else {
      console.log("dbuser", dbUser);
      const result = await bcrypt.compare(
        userDetails.password,
        dbUser.password
      );
      if (!result) {
        throw new Error("Invalid Password");
      } else {
        let shop_id = dbUser.Shop?dbUser.Shop.shop_id : null;
        return jwtUtil.generateToken(dbUser.user_id,shop_id,dbUser.fullname);
      }
    }
  } catch (error) {
    console.error("Error occured:", error);
    throw error;
  }
}

async function get(user_id) {
  try {
    const dbUser = await User.findOne({
      attributes: {
        exclude: ["user_id"],
      },
      where: { user_id: user_id },
    });
    if (!dbUser) {
      throw new Error("User not found");
    } else {
      const [upload_s3_url, countries] = await Promise.all([
        generateSignedUrl(),
        Country.findAll(),
      ]);
      dbUser.dataValues.upload_s3_url = upload_s3_url;
      dbUser.dataValues.countries = countries;
      return dbUser;
    }
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
