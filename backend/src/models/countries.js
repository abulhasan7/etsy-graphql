module.exports = (DataTypes) => {
    return {
      // Model attributes are defined here
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      }
    };
  };
  