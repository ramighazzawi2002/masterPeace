"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, { foreignKey: "user_id" });
      Comment.belongsTo(models.Article, {
        foreignKey: "commentable_id",
        constraints: false,
        as: "article",
      });
      Comment.belongsTo(models.Workshop, {
        foreignKey: "commentable_id",
        constraints: false,
        as: "workshop",
      });
      Comment.belongsTo(models.Product, {
        foreignKey: "commentable_id",
        constraints: false,
        as: "product",
      });
    }
  }
  Comment.init(
    {
      user_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      commentable_id: DataTypes.INTEGER,
      commentable_type: DataTypes.ENUM("WORKSHOP", "ARTICLE", "PRODUCT"),
      rating: DataTypes.INTEGER,
      isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "Comment",
      timestamps: true, // This is default, you can omit this line
    }
  );
  return Comment;
};
