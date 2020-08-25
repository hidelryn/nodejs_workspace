
module.exports = (sequelize, DataTypes) => {
  const players = sequelize.define('players', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull(val) {
          if (!val) {
            throw new Error('선수 이름이 입력되지 않았습니다.');
          }
        },
      },
    },
    position: DataTypes.STRING,
  },
  {
    timestamps: false,
  });
  players.associate = (models) => { // NOTE: N : 1
    players.belongsTo(models.teams);
  };
  return players;
};
