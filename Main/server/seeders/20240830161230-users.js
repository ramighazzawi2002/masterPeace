"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword1 = await bcrypt.hash("password123", 10);
    const hashedPassword2 = await bcrypt.hash("userpass456", 10);
    const hashedPassword3 = await bcrypt.hash("adminpass789", 10);

    const now = new Date();

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "رامي عبد الرحيم صبري غزاوي",
          email: "Rami@example.com",
          password_hash: hashedPassword1,
          is_admin: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          username: "محمد رمضان",
          email: "mohammed@example.com",
          password_hash: hashedPassword2,
          is_admin: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          username: "محمد شراب",
          email: "mohammedShurab@example.com",
          password_hash: hashedPassword3,
          is_admin: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
