"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Workshop extends Model {
    static associate(models) {
      Workshop.belongsTo(models.User, {
        as: "owner",
        foreignKey: "owner_id",
      });
      Workshop.hasMany(models.WorkshopRegistration, {
        as: "registrations",
        foreignKey: "workshop_id",
      });
      Workshop.hasMany(models.Comment, {
        foreignKey: "commentable_id",
        constraints: false,
        scope: {
          commentable_type: "Workshop",
        },
      });
    }
  }
  Workshop.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      topics_covered: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      requirements: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      benefits: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      max_participants: {
        type: DataTypes.INTEGER,
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      image: {
        type: DataTypes.STRING,
      },
      owner_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Workshop",
      timestamps: true,
    }
  );
  return Workshop;
};
