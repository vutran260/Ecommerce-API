'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LP_CATEGORY', 'category_image', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'category_tag',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('LP_CATEGORY', 'category_image');
  },
};
