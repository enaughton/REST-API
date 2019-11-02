"use strict";
const Sequelize = require("sequelize");

module.exports = sequelize => {
  class Course extends Sequelize.Model {}
  Course.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      author: {
        type: Sequelize.STRING
      },
      description: { type: Sequelize.TEXT },
      estimatedtime: { type: Sequelize.STRING, allowNull: true },
      martrialsNeeded: { type: Sequelize.STRING, allowNull: true }
    },
    { sequelize }
  );

  Course.associate = models => {
    Course.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
      allowNull: false
    });
  };

  return Course;
};
