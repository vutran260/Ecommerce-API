'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('LP_SUBSCRIPTION_ADDRESS', {
      subscription_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: 'LP_SUBSCRIPTION',
          key: 'id'
        },
        primaryKey: true
      },
      first_name_kana: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      last_name_kana: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      first_name_kanji: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      last_name_kanji: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      gender: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true
      },
      prefecture_code: {
        type: Sequelize.CHAR(2),
        allowNull: false
      },
      post_code: {
        type: Sequelize.STRING(36),
        allowNull: false
      },
      city_town: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      street_address: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      building_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      telephone_number: {
        type: Sequelize.STRING(36),
        allowNull: false
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
    await queryInterface.dropTable('LP_SUBSCRIPTION_ADDRESS');
  }
};
