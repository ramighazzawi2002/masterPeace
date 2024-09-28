"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Workshops",
      [
        {
          title: "صناعة الفخار التقليدية",
          description:
            "تعلم فن صناعة الفخار باستخدام تقنيات تقليدية قديمة تعود لمئات السنين.",
          topics_covered:
            "تاريخ الفخار، أساسيات التشكيل، تقنيات الزخرفة، عملية الحرق",
          requirements: "لا توجد متطلبات مسبقة, مفتوحة لجميع المستويات",
          duration: "يومان",
          start_time: "10:00:00",
          end_time: "16:00:00",
          cost: 80.0,
          location: "عمان، الأردن",
          benefits: "شهادة إتمام، جميع المواد والأدوات، وجبة غداء خفيفة",
          max_participants: 20,
          is_approved: true,
          owner_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "ورشة النسيج التراثي",
          description:
            "ورشة عملية لاستكشاف فنون النسيج الأردنية التقليدية باستخدام النول اليدوي.",
          topics_covered:
            "تاريخ النسيج الأردني، أنواع الأنوال، تقنيات النسج الأساسية، تصميم النماذج",
          requirements: "لا توجد خبرة سابقة مطلوبة, الاهتمام بالحرف اليدوية",
          duration: "ثلاثة أيام",
          start_time: "09:00:00",
          end_time: "15:00:00",
          cost: 120.0,
          location: "مادبا، الأردن",
          benefits: "شهادة مشاركة، مواد النسيج، قطعة منسوجة من عملك",
          max_participants: 15,
          is_approved: false,
          owner_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "ورشة الطهي التقليدي الأردني",
          description:
            "انضموا إلينا لتعلم طهي وتذوق الأطباق الأردنية الشهيرة مثل المنسف.",
          topics_covered:
            "تاريخ المطبخ الأردني، المكونات التقليدية، تحضير المنسف، أطباق أردنية أخرى",
          requirements: "مهارات طهي أساسية, الشغف بالطعام الأردني",
          duration: "يوم واحد",
          start_time: "11:00:00",
          end_time: "18:00:00",
          cost: 70.0,
          location: "البتراء، الأردن",
          benefits: "كتيب وصفات، مريول الطهي، وجبة غداء من تحضيرك",
          max_participants: 30,
          is_approved: true,
          owner_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Workshops", null, {});
  },
};
