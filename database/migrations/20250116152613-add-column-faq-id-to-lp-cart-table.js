'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LP_CART', 'faq_id', {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'LP_PRODUCT_SPECIAL_FAQ',
        key: 'id',
      },
      after: 'is_special',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('LP_CART', 'faq_id');
  },
};
