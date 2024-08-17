'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('LP_SUBSCRIPTION_PRODUCT', {
      subscription_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: 'LP_SUBSCRIPTION',
          key: 'id'
        },
        primaryKey: true
      },
      product_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: 'LP_PRODUCT',
          key: 'id'
        },
        primaryKey: true
      },
      quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('LP_SUBSCRIPTION_PRODUCT');
  }
};
