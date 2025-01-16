'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LP_PRODUCT_SPECIAL_FAQ', 'status', {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: 'NEW',
      after: 'product_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('LP_PRODUCT_SPECIAL_FAQ', 'status');
  },
};
