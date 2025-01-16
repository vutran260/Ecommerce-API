'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LP_CART', 'is_special', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Is special product',
      after: 'quantity',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('LP_CART', 'is_special');
  },
};
