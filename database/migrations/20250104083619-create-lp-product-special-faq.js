'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'LP_PRODUCT_SPECIAL_QUESTIONS',
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        question: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        type: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        answer_template: {
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LP_PRODUCT_SPECIAL_QUESTIONS');
  },
};
