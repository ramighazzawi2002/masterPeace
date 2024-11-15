"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Products",
      [
        {
          author_id: 1,
          name: "سجادة أردنية تقليدية",
          description: "سجادة يدوية الصنع من الصوف بنقوش أردنية تقليدية",
          price: 199.99,
          stock: 50,
          is_approved: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          image: "سجادة-اردنية-تقليدية.jfif",
        },
        {
          author_id: 2,
          name: "إبريق قهوة بدوي",
          description:
            "إبريق قهوة نحاسي مزخرف يستخدم في تقديم القهوة العربية التقليدية",
          price: 39.99,
          stock: 100,
          is_approved: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          image: "ابريق-قهوة.jfif",
        },
        {
          author_id: 3,
          name: "ثوب أردني مطرز",
          description: "ثوب نسائي تقليدي مطرز يدويًا بتصاميم أردنية أصيلة",
          price: 299.99,
          stock: 30,
          is_approved: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          image: "ثوب-اردني-مطرز.jpg",
        },
        {
          author_id: 1,
          name: "خنجر أردني تقليدي",
          description:
            "خنجر مزخرف يدويًا يعكس الحرف اليدوية الأردنية التقليدية",
          price: 149.99,
          stock: 25,
          is_approved: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          image: "خنجر-اردني-تقليدي.jpg",
        },
        {
          author_id: 2,
          name: "فخار جرش",
          description: "وعاء فخاري مصنوع يدويًا في مدينة جرش الأثرية",
          price: 59.99,
          stock: 75,
          is_approved: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          image: "فخار-جرش.jpg",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
