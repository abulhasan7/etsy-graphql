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
        // allowNull defaults to true
        allowNull: false,
      },
      item_pic: {
        type: DataTypes.STRING,
        // allowNull defaults to true
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(45),
        // allowNull defaults to true
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        // allowNull defaults to true
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10,2),
        // allowNull defaults to true
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        // allowNull defaults to true
        allowNull: false,
      },
      sold_count: {
        type: DataTypes.INTEGER,
        // allowNull defaults to true
        // allowNull: false,
      },
      shop_id: {
        type: DataTypes.INTEGER,
        // allowNull defaults to true
        // allowNull: false,
      }
    };
  };
  