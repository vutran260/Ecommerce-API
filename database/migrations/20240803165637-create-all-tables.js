'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // LP_ADMIN table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_ADMIN (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        email VARCHAR(255),
        phone VARCHAR(225),
        password VARCHAR(225),
        username VARCHAR(225),
        fullname VARCHAR(225),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    // LP_STORE table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_STORE (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        contract_id VARCHAR(225) NOT NULL,
        store_key VARCHAR(255) UNIQUE,
        store_name VARCHAR(255),
        store_name_kana VARCHAR(255),
        company_name VARCHAR(255) NOT NULL,
        company_address VARCHAR(255) NOT NULL,
        owner VARCHAR(255),
        zip_code VARCHAR(255),
        phone VARCHAR(255),
        reject_reason VARCHAR(255),
        status VARCHAR(255),
        remark VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,
        UNIQUE(contract_id)
      );
    `);

    // LP_SELLER table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_SELLER (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        prefecture_id VARCHAR(225),
        store_id VARCHAR(36),
        email VARCHAR(255),
        phone VARCHAR(225),
        password VARCHAR(225),
        office_name VARCHAR(225),
        office_name_kana VARCHAR(225),
        post_code VARCHAR(225),
        address VARCHAR(225),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,
        CONSTRAINT fk_store_id_seller FOREIGN KEY (store_id) REFERENCES LP_STORE (id)
      );
    `);

    // LP_BUYER table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_BUYER (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        username VARCHAR(225),
        fullname VARCHAR(225),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    // LP_STORE_BUYER table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_STORE_BUYER (
        store_id VARCHAR(36) NOT NULL,
        buyer_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT FOREIGN KEY (store_id) REFERENCES LP_STORE (id),
        CONSTRAINT FOREIGN KEY (buyer_id) REFERENCES LP_BUYER (id),
        PRIMARY KEY (store_id, buyer_id)
      );
    `);

    // LP_PRODUCT table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_PRODUCT (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        store_id VARCHAR(36) NOT NULL,
        is_subscription TINYINT(1) NOT NULL,
        buying_period VARCHAR(255),
        is_discount TINYINT NOT NULL,
        discount_percentage TINYINT UNSIGNED,
        has_discount_schedule TINYINT,
        discount_time_from TIMESTAMP,
        discount_time_to TIMESTAMP,
        is_recommend TINYINT NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_image VARCHAR(2000) NOT NULL,
        product_description VARCHAR(2000) NOT NULL,
        product_overview VARCHAR(2000) NOT NULL,
        price INT UNSIGNED NOT NULL,
        price_subscription INT UNSIGNED,
        cost DECIMAL(10,4),
        stock_item INT UNSIGNED,
        product_tag VARCHAR(255),
        status VARCHAR(255),
        is_deleted TINYINT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,
        CONSTRAINT fk_store_id_product FOREIGN KEY (store_id) REFERENCES LP_STORE (id)
      );
    `);

    // LP_PRODUCT_COMPONENT table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_PRODUCT_COMPONENT (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        product_id VARCHAR(36) NOT NULL,
        component_value VARCHAR(255) NOT NULL,
        component_name VARCHAR(255),
        CONSTRAINT fk_product_id_component FOREIGN KEY (product_id) REFERENCES LP_PRODUCT (id)
      );
    `);

    // LP_PRODUCT_FAQ table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_PRODUCT_FAQ (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        product_id VARCHAR(36) NOT NULL,
        question VARCHAR(100) NOT NULL,
        answer VARCHAR(100) NOT NULL,
        CONSTRAINT fk_product_id_faq FOREIGN KEY (product_id) REFERENCES LP_PRODUCT (id)
      );
    `);

    // LP_CATEGORY table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_CATEGORY (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        store_id VARCHAR(36) NOT NULL,
        parent_id VARCHAR(36),
        category_name VARCHAR(255),
        category_tag VARCHAR(255),
        status VARCHAR(255),
        order_level INT(11) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,
        CONSTRAINT fk_store_id_category FOREIGN KEY (store_id) REFERENCES LP_STORE (id)
      );
    `);

    // LP_PRODUCT_CATEGORY table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_PRODUCT_CATEGORY (
        product_id VARCHAR(36) NOT NULL,
        category_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(225),
        CONSTRAINT FOREIGN KEY (product_id) REFERENCES LP_PRODUCT (id),
        CONSTRAINT FOREIGN KEY (category_id) REFERENCES LP_CATEGORY (id),
        PRIMARY KEY (product_id, category_id)
      );
    `);

    // LP_CART table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_CART (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        buyer_id VARCHAR(36) NOT NULL,
        store_id VARCHAR(36) NOT NULL,
        product_id VARCHAR(36) NOT NULL,
        quantity INT UNSIGNED NOT NULL,
        is_subscription TINYINT NOT NULL,
        buying_period TINYINT UNSIGNED,
        start_buying_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(225),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        updated_by VARCHAR(225),
        CONSTRAINT FOREIGN KEY (buyer_id) REFERENCES LP_BUYER (id),
        CONSTRAINT FOREIGN KEY (store_id) REFERENCES LP_STORE (id),
        CONSTRAINT FOREIGN KEY (product_id) REFERENCES LP_PRODUCT (id)
      );
    `);

    // LP_ADDRESS_BUYER table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_ADDRESS_BUYER (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        buyer_id VARCHAR(36) NOT NULL,
        store_id VARCHAR(36) NOT NULL,
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
        CONSTRAINT fk_buyer_id FOREIGN KEY (buyer_id) REFERENCES LP_BUYER (id),
        CONSTRAINT fk_store_id FOREIGN KEY (store_id) REFERENCES LP_STORE (id)
      );
    `);

    // LP_STORE_POST table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_STORE_POST (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        store_id VARCHAR(36) NOT NULL,
        post_image VARCHAR(2000) NOT NULL,
        title TINYTEXT NOT NULL,
        details TEXT NOT NULL,
        status VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(225),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        updated_by VARCHAR(225),
        CONSTRAINT FOREIGN KEY (store_id) REFERENCES LP_STORE (id)
      );
    `);

    // LP_ADDRESS_BUYER_SSO table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_ADDRESS_BUYER_SSO (
        buyer_id VARCHAR(36) NOT NULL PRIMARY KEY,
        email TEXT NOT NULL,
        telephone_number VARCHAR(255) NOT NULL,
        contact_telephone_number VARCHAR(36) NOT NULL,
        post_code VARCHAR(36) NOT NULL,
        prefecture_code CHAR(2) NOT NULL,
        city_town VARCHAR(255) NOT NULL,
        building_name VARCHAR(255) NOT NULL,
        CONSTRAINT fk_address_buyer_id FOREIGN KEY (buyer_id) REFERENCES LP_BUYER (id)
      );
    `);

    // LP_BUYER_PERSONAL_INFORMATION table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_BUYER_PERSONAL_INFORMATION (
        buyer_id VARCHAR(36) NOT NULL PRIMARY KEY,
        nickname TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        first_name_kana TEXT NOT NULL,
        last_name_kana TEXT NOT NULL,
        prefecture_code CHAR(2) NOT NULL,
        gender TINYINT(1) UNSIGNED,
        birthday DATE,
        age CHAR(3),
        CONSTRAINT fk_buyer_personal_info_buyer_id FOREIGN KEY (buyer_id) REFERENCES LP_BUYER (id)
      );
    `);

    // LP_PREFECTURES table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_PREFECTURES (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        prefecture_name CHAR(225)
      );
    `);

    // LP_ORDER table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_ORDER (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        buyer_id VARCHAR(36),
        store_id VARCHAR(36),
        order_status VARCHAR(100),
        amount INT UNSIGNED NOT NULL,
        shipment_fee INT,
        discount INT,
        total_amount INT UNSIGNED NOT NULL,
        cancel_at DATETIME,
        created_at DATETIME,
        created_by VARCHAR(255),
        updated_at DATETIME,
        updated_by VARCHAR(255),
        CONSTRAINT FOREIGN KEY (buyer_id) REFERENCES LP_BUYER (id),
        CONSTRAINT FOREIGN KEY (store_id) REFERENCES LP_STORE (id)
      );
    `);

    // LP_ORDER_ITEM table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_ORDER_ITEM (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        order_id VARCHAR(36),
        product_id VARCHAR(36),
        product_name VARCHAR(255) NOT NULL,
        product_image VARCHAR(2000) NOT NULL,
        product_description VARCHAR(2000) NOT NULL,
        product_overview VARCHAR(2000) NOT NULL,
        price INT,
        quantity INT UNSIGNED NOT NULL,
        created_at DATETIME,
        updated_at DATETIME,
        deleted_at DATETIME,
        CONSTRAINT FOREIGN KEY (order_id) REFERENCES LP_ORDER (id),
        CONSTRAINT FOREIGN KEY (product_id) REFERENCES LP_PRODUCT (id)
      );
    `);

    // LP_ORDER_PAYMENT table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_ORDER_PAYMENT (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        order_id VARCHAR(36),
        payment_type VARCHAR(255),
        payment_status VARCHAR(100),
        created_at DATETIME,
        updated_at DATETIME,
        deleted_at DATETIME,
        CONSTRAINT FOREIGN KEY (order_id) REFERENCES LP_ORDER (id)
      );
    `);

    // LP_SHIPMENT table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_SHIPMENT (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        order_id VARCHAR(36),
        shipment_fee INT,
        shipment_fee_discount INT,
        arrived_at DATETIME,
        plan_arrived_from DATETIME,
        plan_arrived_to DATETIME,
        shipment_by VARCHAR(255),
        created_at DATETIME,
        updated_at DATETIME,
        deleted_at DATETIME,
        CONSTRAINT FOREIGN KEY (order_id) REFERENCES LP_ORDER (id)
      );
    `);

    // LP_SHIPMENT_HISTORY table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_SHIPMENT_HISTORY (
        id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        shipment_id VARCHAR(36),
        shipment_history_date DATETIME,
        shipment_status VARCHAR(100),
        shipment_description TEXT,
        created_at DATETIME,
        updated_at DATETIME,
        deleted_at DATETIME,
        CONSTRAINT FOREIGN KEY (shipment_id) REFERENCES LP_SHIPMENT (id)
      );
    `);

    // LP_ORDER_ADDRESS_BUYER table
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

    // LP_FAVORITE table
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS LP_FAVORITE (
        buyer_id VARCHAR(36) NOT NULL,
        product_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
        CONSTRAINT fk_buyer_id_favorite FOREIGN KEY (buyer_id) REFERENCES LP_BUYER (id),
        CONSTRAINT fk_product_id_favorite FOREIGN KEY (product_id) REFERENCES LP_PRODUCT (id),
      
        PRIMARY KEY (buyer_id, product_id)
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_SHIPMENT_HISTORY`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_SHIPMENT`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_ORDER_PAYMENT`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_ORDER_ITEM`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_ORDER`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_PREFECTURES`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_BUYER_PERSONAL_INFORMATION`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_ADDRESS_BUYER_SSO`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_STORE_POST`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_ADDRESS_BUYER`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_CART`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_PRODUCT_CATEGORY`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_CATEGORY`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_PRODUCT_FAQ`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_PRODUCT_COMPONENT`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_PRODUCT`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_STORE_BUYER`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_BUYER`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_SELLER`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_STORE`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_ADMIN`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_ORDER_ADDRESS_BUYER`);
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS LP_FAVORITE`);
  }
};
