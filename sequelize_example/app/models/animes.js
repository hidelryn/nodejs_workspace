
module.exports = (sequelize, DataTypes) => {
  const animes = sequelize.define('animes', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    quarter: DataTypes.STRING,
    createAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  });
  return animes;
};
