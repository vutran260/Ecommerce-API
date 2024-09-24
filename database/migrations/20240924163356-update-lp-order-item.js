'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LP_ORDER_ITEM', 'original_price', {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: 'price',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('LP_ORDER_ITEM', 'original_price');
  },
};
