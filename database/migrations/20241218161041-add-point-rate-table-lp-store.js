'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LP_STORE', 'point_rate', {
      type: Sequelize.DECIMAL(3, 1).UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      comment: 'Point rate',
      after: 'reject_reason',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('LP_ORDER', 'point_rate');
  },
};
