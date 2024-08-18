'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LP_SUBSCRIPTION', {
      id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('(UUID())'),
      },
      buyer_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: 'LP_BUYER',
          key: 'id',
        },
      },
      store_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: 'LP_STORE',
          key: 'id',
        },
      },
      subscription_status: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      start_date: { type: Sequelize.DATE, allowNull: false },
      next_date: { type: Sequelize.DATE, allowNull: false },
      plan_delivery_time: { type: Sequelize.TIME, allowNull: true },
      subscription_period: { type: Sequelize.INTEGER, allowNull: false },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LP_SUBSCRIPTION');
  },
};
