module.exports = (DataTypes) => {
    return {
      // Model attributes are defined here
      order_details_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        // allowNull defaults to true
        allowNull: false,
      },
      
      item_quantity: {
        type: DataTypes.INTEGER,
        // allowNull defaults to true
        allowNull: false,
      },
      unit_price: {
        type: DataTypes.DECIMAL(10,2),
        // allowNull defaults to true
        allowNull: false,
      },
      shop_id: {
        type: DataTypes.INTEGER,
        // allowNull defaults to true
        allowNull: false,
      },
      item_name: {
        type: DataTypes.STRING(45),
        // allowNull defaults to true
        allowNull: false,
      },
      item_pic: {
        type: DataTypes.STRING,
        // allowNull defaults to true
        allowNull: false,
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
    };
  };
  