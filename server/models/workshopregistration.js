"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WorkshopRegistration extends Model {
    static associate(models) {
      WorkshopRegistration.belongsTo(models.User, {
        as: "user",
        foreignKey: "user_id",
      });
      WorkshopRegistration.belongsTo(models.Workshop, {
        as: "workshop",
        foreignKey: "workshop_id",
      });
    }
  }
  WorkshopRegistration.init(
    {
      workshop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.ENUM("paypal", "stripe"),
        allowNull: false,
      },
      amount_paid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "WorkshopRegistration",
      timestamps: true,
    }
  );
  return WorkshopRegistration;
};
