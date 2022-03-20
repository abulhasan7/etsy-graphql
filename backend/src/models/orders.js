module.exports = (DataTypes) =>
  ({
  // Model attributes are defined here
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    order_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    total_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
