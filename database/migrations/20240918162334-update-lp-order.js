'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('LP_ORDER', 'order_type', {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'NORMAL',
      after: 'order_status',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('LP_ORDER', 'order_type');
  },
};
