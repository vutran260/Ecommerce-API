'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the existing shipment_id column
    await queryInterface.removeColumn('LP_SHIPMENT_HISTORY', 'shipment_id');

    // Add the new order_id column and foreign key constraint
    await queryInterface.addColumn('LP_SHIPMENT_HISTORY', 'order_id', {
      type: Sequelize.STRING(36),
      allowNull: false
    });

    // Add the foreign key constraint
    await queryInterface.addConstraint('LP_SHIPMENT_HISTORY', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'LP_SHIPMENT_HISTORY_order_id_fkey',
      references: {
        table: 'LP_ORDER',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Leave this empty if you do not need to revert the migration
  }
};
