module.exports = (DataTypes) => {
    return {
      // Model attributes are defined here
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      item_pic_url: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          if(this.getDataValue('item_pic_url'))
            return this.getDataValue('item_pic_url')
          return ""
        }
      },
      category: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sold_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    };
  };
  