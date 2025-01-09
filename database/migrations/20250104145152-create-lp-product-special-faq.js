'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'LP_PRODUCT_SPECIAL_FAQ',
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
        product_id: {
          type: Sequelize.STRING(36),
          allowNull: false,
          references: {
            model: 'LP_PRODUCT',
            key: 'id',
          },
        },
        question_1: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        answer_1: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        question_2: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        answer_2: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        question_3: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        answer_3: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        question_4: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        answer_4: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        question_5: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        answer_5: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        question_6: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        answer_6: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        question_7: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        answer_7: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        question_8: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        answer_8: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        question_9: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        answer_9: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        question_10: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        answer_10: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        question_11: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        answer_11: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        question_12: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        answer_12: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        question_13: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        answer_13: {
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
      },
      {
        charset: 'utf8mb4',
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LP_PRODUCT_SPECIAL_FAQ');
  },
};
