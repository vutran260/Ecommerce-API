'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LP_ORDER', 'point_receive', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Point received',
      after: 'point_use',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('LP_ORDER', 'point_receive');
  },
};
