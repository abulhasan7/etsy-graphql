module.exports = (DataTypes) => {
    return {
      // Model attributes are defined here
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      shop_name: {
        type: DataTypes.STRING(60),
        // allowNull defaults to true
        allowNull: false,
      },
      shop_pic_url: {
        type: DataTypes.STRING(45),
        get() {
          if(this.getDataValue('shop_pic_url'))
            return this.getDataValue('shop_pic_url')
          return ""
        }
      },
      user_id:{
          type:DataTypes.INTEGER,
          allowNull: false
      }
    };
  };
  