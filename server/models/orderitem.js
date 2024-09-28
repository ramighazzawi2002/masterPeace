"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.User, { foreignKey: "user_id" });
      OrderItem.belongsTo(models.Product, { foreignKey: "product_id" });
    }
  }
  OrderItem.init(
    {
      user_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "OrderItem",
      timestamps: true, // This is default, you can omit this line
    }
  );
  return OrderItem;
};
