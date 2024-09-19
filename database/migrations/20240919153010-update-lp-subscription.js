'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'LP_SUBSCRIPTION',
      'plan_delivery_time',
      'plan_delivery_time_from',
    );

    await queryInterface.addColumn('LP_SUBSCRIPTION', 'plan_delivery_time_to', {
      type: Sequelize.TIME,
      allowNull: true,
      after: 'plan_delivery_time_from',
    });
  },

  async down(queryInterface, Sequelize) {},
};
