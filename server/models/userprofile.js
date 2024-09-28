"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      UserProfile.belongsTo(models.User);
    }
  }
  UserProfile.init(
    {
      user_id: DataTypes.INTEGER,
      bio: DataTypes.TEXT,
      location: DataTypes.STRING,
      interests: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "UserProfile",
      timestamps: true, // This is default, you can omit this line
    }
  );
  return UserProfile;
};
