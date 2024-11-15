"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      Article.belongsTo(models.User, { as: "author", foreignKey: "author_id" });
      Article.hasMany(models.Comment, {
        foreignKey: "commentable_id",
        constraints: false,
        scope: {
          commentable_type: "ARTICLE",
        },
      });
    }
  }
  Article.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      breif: DataTypes.STRING,
      author_id: DataTypes.INTEGER,
      is_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Article",
    }
  );
  return Article;
};
