
module.exports = (sequelize, DataTypes) => {
  const teams = sequelize.define('teams', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull(val) {
          if (!val) {
            throw new Error('팀 이름이 입력되지 않았습니다.');
          }
        },
      },
    },
    place: DataTypes.STRING,
  },
  {
    timestamps: false,
  });
  teams.associate = (models) => { // NOTE: 1 : N
    teams.hasMany(models.players);
  };
  return teams;
};
