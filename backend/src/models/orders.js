module.exports = (DataTypes) => {
    return {
      // Model attributes are defined here
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      order_date: {
        type: DataTypes.DATEONLY,
        // allowNull defaults to true
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        // allowNull defaults to true
        allowNull: false,
      },
      total_price:{
          type:DataTypes.DECIMAL(10,2)
      },
      total_quantity: {
        type: DataTypes.INTEGER,
        // allowNull defaults to true
        allowNull: false,
      },
    };
  };
  