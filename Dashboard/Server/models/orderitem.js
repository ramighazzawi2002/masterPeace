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
      full_name: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      payment_method: DataTypes.ENUM("paypal", "stripe"),
      amount_paid: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: "OrderItem",
      timestamps: true,
    }
  );
  return OrderItem;
};
