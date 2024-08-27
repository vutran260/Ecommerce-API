'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the existing id column
    await queryInterface.removeColumn('LP_SHIPMENT', 'id');

    // Change order_id to be the primary key and not nullable
    await queryInterface.changeColumn('LP_SHIPMENT', 'order_id', {
      type: Sequelize.STRING(36),
      allowNull: false,
      primaryKey: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
