'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LP_SELLER_SSO', {
      seller_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'LP_SELLER',
          key: 'id',
        },
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      first_name_kanji: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_name_kanji: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      first_name_kana: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_name_kana: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birthday: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
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
    await queryInterface.dropTable('LP_SELLER_SSO');
  },
};
