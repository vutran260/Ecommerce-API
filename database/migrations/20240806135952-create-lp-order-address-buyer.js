'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_ORDER_ADDRESS_BUYER(
        order_id VARCHAR(36) NOT NULL PRIMARY KEY,
        name_kana VARCHAR(255) NOT NULL,
        name_kanji VARCHAR(255) NOT NULL,
        post_code VARCHAR(36) NOT NULL,
        city_town VARCHAR(255) NOT NULL,
        street_address VARCHAR(255) NOT NULL,
        building_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telephone_number VARCHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      
        CONSTRAINT FOREIGN KEY (order_id) REFERENCES LP_ORDER(id)
      );
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('LP_ORDER_ADDRESS_BUYER');
  }
};
