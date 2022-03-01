module.exports = (DataTypes) => {
    return {
      // Model attributes are defined here
      favourite_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        // allowNull defaults to true
        allowNull: false,
      },
      item_id: {
        type: DataTypes.INTEGER,
        // allowNull defaults to true
        allowNull: false,
      },
  
    };
  };
  