const { User } = require("../models/index");
const bcrypt = require("bcrypt");
const jwtUtil = require("../utils/jwtUtil");

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
        return token ;
      }
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
        const dob = userDetails.dob.split("-");
        return User.create({
          fullname: userDetails.fullname,
          email: userDetails.email,
          password: hashedValue,
          phone: userDetails.phone,
          gender: userDetails.gender,
          dob: new Date(dob[0], dob[1] - 1, dob[2]),
          about: userDetails.about,
          profile_pic: userDetails.profile_pic,
          address_1: userDetails.address_1,
          address_2: userDetails.address_2,
          city: userDetails.city,
          country: userDetails.country,
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

function updateProfile(userDetails){
  return new Promise((resolve,reject)=>{
    bcrypt
    .hash(userDetails.password, 10)
    .then((hashedValue) => {
      const dob = userDetails.dob.split("-");
      return User.update({
        fullname: userDetails.fullname,
        email: userDetails.email,
        password: hashedValue,
        phone: userDetails.phone,
        gender: userDetails.gender,
        dob: new Date(dob[0], dob[1] - 1, dob[2]),
        about: userDetails.about,
        profile_pic: userDetails.profile_pic,
        address_1: userDetails.address_1,
        address_2: userDetails.address_2,
        city: userDetails.city,
        country: userDetails.country,
      },
      {
        where:{user_id:userDetails.user_id}
      });
    })
    .then((created) => {
      if(created[0] > 0){
        resolve("User Profile updated successfully");
      }
      throw new Error("User not found");
      // reject("User already registered");
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
  })
}
module.exports = { login, register,updateProfile };
