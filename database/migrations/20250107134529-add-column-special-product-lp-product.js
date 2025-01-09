'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LP_PRODUCT', 'is_special', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Is special product',
      after: 'is_subscription',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('LP_PRODUCT', 'is_special');
  },
};
