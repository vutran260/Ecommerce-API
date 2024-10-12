'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LP_ORDER_PAYMENT', 'gmo_access_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'payment_status',
    });

    await queryInterface.addColumn('LP_ORDER_PAYMENT', 'gmo_access_pass', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'gmo_access_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('LP_ORDER_PAYMENT', 'gmo_access_id');
    await queryInterface.removeColumn('LP_ORDER_PAYMENT', 'gmo_access_pass');
  },
};
