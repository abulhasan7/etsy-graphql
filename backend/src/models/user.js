module.exports = (DataTypes) =>
  ({
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
      get() {
        if (this.getDataValue('phone')) return this.getDataValue('phone');
        return '';
      },
    },
    gender: {
      type: DataTypes.STRING(1),
      get() {
        if (this.getDataValue('gender')) return this.getDataValue('gender');
        return '';
      },
    },
    dob: {
      type: DataTypes.DATEONLY,
      get() {
        if (this.getDataValue('dob')) return this.getDataValue('dob');
        return '';
      },
    },
    about: {
      type: DataTypes.STRING,
      get() {
        if (this.getDataValue('about')) return this.getDataValue('about');
        return '';
      },
    },
    profile_pic_url: {
      type: DataTypes.STRING,
      get() {
        if (this.getDataValue('profile_pic_url')) return this.getDataValue('profile_pic_url');
        return '';
      },
    },
    address_1: {
      type: DataTypes.STRING(60),
      get() {
        if (this.getDataValue('address_1')) return this.getDataValue('address_1');
        return '';
      },
    },
    address_2: {
      type: DataTypes.STRING(45),
      get() {
        if (this.getDataValue('address_2')) return this.getDataValue('address_2');
        return '';
      },
    },
    city: {
      type: DataTypes.STRING(60),
      get() {
        if (this.getDataValue('city')) return this.getDataValue('city');
        return '';
      },
    },
    country: {
      type: DataTypes.STRING,
      get() {
        if (this.getDataValue('country')) return this.getDataValue('country');
        return '';
      },
    },
  });
