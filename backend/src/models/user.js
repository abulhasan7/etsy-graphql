module.exports = (DataTypes) => {
  return {
    // Model attributes are defined here
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    fullname: {
      type: DataTypes.STRING(60),
      // allowNull defaults to true
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(45),
      // allowNull defaults to true
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      // allowNull defaults to true
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      // allowNull defaults to true
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(1),
      // allowNull defaults to true
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      // allowNull defaults to true
      allowNull: false,
    },
    about: {
      type: DataTypes.STRING,
      // allowNull defaults to true
      // allowNull: false,
    },
    profile_pic: {
      type: DataTypes.STRING,
      // allowNull defaults to true
      // allowNull: false,
    },
    address_1: {
      type: DataTypes.STRING(60),
      // allowNull defaults to true
      // allowNull: false,
    },
    address_2: {
      type: DataTypes.STRING(45),
      // allowNull defaults to true
      // allowNull: false,
    },
    city: {
      type: DataTypes.STRING(60),
      // allowNull defaults to true
      // allowNull: false,
    }
  };
};
