'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'LP_POINT_HISTORY_LOGS',
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
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
        order_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
          references: {
            model: 'LP_ORDER',
            key: 'id',
          },
        },
        point_action: {
          type: Sequelize.STRING(500),
          allowNull: true,
        },
        point_before: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        point_after: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        point_count: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        request_point: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        request_point_type: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        request_status: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
        },
      },
      {
        charset: 'utf8mb4',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('point_history_logs');
  },
};
