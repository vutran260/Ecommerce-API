'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      { tableName: 'LP_PRODUCT_FAQ' },
      'question',
      {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
    );
    await queryInterface.changeColumn(
      { tableName: 'LP_PRODUCT_FAQ' },
      'answer',
      {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      { tableName: 'LP_PRODUCT_FAQ' },
      'question',
      {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
    );

    await queryInterface.changeColumn(
      { tableName: 'LP_PRODUCT_FAQ' },
      'answer',
      {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
    );
  },
};
