'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.renameColumn(
      'LP_ADDRESS_BUYER',
      'name_kana',
      'first_name_kana',
    );

    await queryInterface.addColumn('LP_ADDRESS_BUYER', 'last_name_kana', {
      type: Sequelize.STRING(255),
      allowNull: false,
      after: 'first_name_kana',
    });

    await queryInterface.renameColumn(
      'LP_ADDRESS_BUYER',
      'name_kanji',
      'first_name_kanji',
    );

    await queryInterface.addColumn('LP_ADDRESS_BUYER', 'last_name_kanji', {
      type: Sequelize.STRING(255),
      allowNull: false,
      after: 'first_name_kanji',
    });

    await queryInterface.addColumn('LP_ADDRESS_BUYER', 'gender', {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: true,
      after: 'last_name_kanji',
    });

    await queryInterface.addColumn('LP_ADDRESS_BUYER', 'prefecture_code', {
      type: Sequelize.CHAR(2),
      allowNull: false,
      after: 'gender',
    });

    await queryInterface.addColumn('LP_ADDRESS_BUYER', 'agreed', {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: true,
      after: 'prefecture_code',
    });

    await queryInterface.addColumn('LP_ADDRESS_BUYER', 'keep_contact', {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: true,
      after: 'agreed',
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
