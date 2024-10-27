"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Article, { as: "articles", foreignKey: "author_id" });
      User.hasMany(models.Workshop, {
        as: "workshops",
        foreignKey: "owner_id",
      });
      User.hasMany(models.Product, { as: "products", foreignKey: "author_id" });
      User.hasMany(models.WorkshopRegistration, {
        foreignKey: "user_id",
      });
      User.hasMany(models.OrderItem, { foreignKey: "user_id" });
      User.hasMany(models.Comment, { foreignKey: "user_id" });
      User.hasMany(models.Cart, {
        foreignKey: "userId",
        as: "carts",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password_hash: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notNullIfLocal(value) {
            if (this.auth_type === "local" && !value) {
              throw new Error("Password is required for local authentication");
            }
          },
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
      auth_type: {
        type: DataTypes.ENUM("local", "google"),
        allowNull: false,
        defaultValue: "local",
      },
      // role: {
      //   type: DataTypes.ENUM("user", "admin"),
      //   defaultValue: "user",
      // },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true, // This is default, you can omit this line
    }
  );
  return User;
};
