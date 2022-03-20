module.exports = (DataTypes) =>
  ({
  // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      get() {
        if (this.getDataValue('name')) return this.getDataValue('name');
        return '';
      },
    },
  });
