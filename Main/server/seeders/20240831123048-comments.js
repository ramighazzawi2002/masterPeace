"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      "Comments",
      [
        {
          user_id: 1,
          content: "هذا تعليق من رامي عبد الرحيم صبري غزاوي",
          commentable_id: 1,
          commentable_type: "WORKSHOP",
          rating: 5,
          isDeleted: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          user_id: 2,
          content: "هذا تعليق من محمد رمضان",
          commentable_id: 1,
          commentable_type: "ARTICLE",
          rating: 4,
          isDeleted: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          user_id: 3,
          content: "هذا تعليق من محمد شراب",
          commentable_id: 1,
          commentable_type: "PRODUCT",
          rating: 3,
          isDeleted: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Comments", null, {});
  },
};
