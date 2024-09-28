"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.User, { as: "author", foreignKey: "author_id" });
      Product.hasMany(models.OrderItem, { foreignKey: "product_id" });
      Product.hasMany(models.Comment, {
        foreignKey: "commentable_id",
        constraints: false,
        scope: {
          commentable_type: "PRODUCT",
        },
      });
      Product.hasMany(models.Cart, {
        foreignKey: "productId",
        as: "cartEntries",
      });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.DECIMAL,
      stock: DataTypes.INTEGER,
      author_id: DataTypes.INTEGER,
      is_approved: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Product",
      timestamps: true, // This is default, you can omit this line
    }
  );
  return Product;
};
