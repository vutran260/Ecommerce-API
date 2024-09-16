'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LP_PRODUCT_RECENTLY_VIEWED', {
      buyer_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'LP_BUYER',
          key: 'id',
        },
      },
      product_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'LP_PRODUCT',
          key: 'id',
        },
      },
      viewed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LP_PRODUCT_RECENTLY_VIEWED');
  },
};
