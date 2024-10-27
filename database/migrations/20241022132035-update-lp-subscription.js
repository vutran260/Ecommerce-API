'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LP_SUBSCRIPTION', 'retry_attempts', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Track retry attempts',
      after: 'subscription_period',
    });
    await queryInterface.addColumn('LP_SUBSCRIPTION', 'retry_status', {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: 'Status of the retry process',
      after: 'retry_attempts',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('LP_SUBSCRIPTION', 'retry_attempts');
    await queryInterface.removeColumn('LP_SUBSCRIPTION', 'retry_status');
  },
};
