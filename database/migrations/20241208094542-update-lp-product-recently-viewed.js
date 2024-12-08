'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LP_PRODUCT_RECENTLY_VIEWED', 'store_id', {
      type: Sequelize.STRING(36),
      allowNull: false,
      references: {
        model: 'LP_STORE',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('LP_PRODUCT_RECENTLY_VIEWED', 'store_id');
  },
};
