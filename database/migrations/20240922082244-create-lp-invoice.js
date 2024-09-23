'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LP_INVOICE', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'LP_ORDER',
          key: 'id',
        },
      },
      invoice_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      tax_amount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      issued_by: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      to_email: {
        type: Sequelize.STRING(255),
        allowNull: false,
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
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LP_INVOICE');
  },
};
