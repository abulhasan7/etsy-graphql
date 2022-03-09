const { User } = require("../models/index");
const bcrypt = require("bcrypt");
const jwtUtil = require("../utils/jwtUtil");
const { upload, download } = require("../utils/s3");
async function login(userDetails) {
  try {
    const dbUser = await User.findOne({
      attributes: ["email", "password"],
      where: { email: userDetails.email },
    });
    if (!dbUser) {
      throw new Error("User not found");
    } else {
      const result = await bcrypt.compare(
        userDetails.password,
        dbUser.password
      );
      if (!result) {
        throw new Error("Invalid Password");
      } else {
        const token = jwtUtil.generateToken(dbUser.email);
        return token;
      }
    }
  } catch (error) {
    console.error("Error occured:", error);
    throw error;
  }
}

async function get(userDetails) {
  try {
    const dbUser = await User.findOne({
      //TODO REMOVE hardcoded emaiol
      where: { email: "abul@hasa.com" },
    });
    if (!dbUser) {
      throw new Error("User not found");
    } else {
      console.log(dbUser);
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
      .then((created) => {
        resolve("User registered successfully");
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

function updateProfile(profile_pic, user) {
  console.log;
  return new Promise((resolve, reject) => {
    const userDetails = JSON.parse(user);
    upload(profile_pic)
      .then((res) => {
        console.log(res);
        const dob = userDetails.dob.split("-");
        return User.update(
          {
            fullname: userDetails.fullname,
            phone: userDetails.phone,
            gender: userDetails.gender,
            dob: new Date(dob[0], dob[1] - 1, dob[2]),
            about: userDetails.about,
            profile_pic: res.Location, //key
            address_1: userDetails.address_1,
            address_2: userDetails.address_2,
            city: userDetails.city,
            country: userDetails.country,
          },
          {
            //TODO remove hardcoding of 26
            where: { user_id: 26 },
          }
        );
      })
      .then((created) => {
        if (created[0] > 0) {
          resolve("User Profile updated successfully");
        } else {
          throw new Error("User not found");
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
module.exports = { login,get, register, updateProfile };
