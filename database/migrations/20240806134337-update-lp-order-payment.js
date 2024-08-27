'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the existing id column
    await queryInterface.removeColumn('LP_ORDER_PAYMENT', 'id');

    // Change order_id to be the primary key and not nullable
    await queryInterface.changeColumn('LP_ORDER_PAYMENT', 'order_id', {
      type: Sequelize.STRING(36),
      allowNull: false,
      primaryKey: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // DO NOTHING
  },
};
