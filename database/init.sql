CREATE TABLE  LP_ADMIN (
    id VARCHAR(255) NOT NULL PRIMARY KEY DEFAULT (uuid()),
    email VARCHAR(255),
    phone VARCHAR(225),
    password VARCHAR(225),
    username VARCHAR(225),
    fullname VARCHAR(225),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
  );

INSERT INTO LP_ADMIN
(email, phone, password, username, fullname)
VALUES( 'email', 'phone', 'password', 'username', 'fullname');

CREATE TABLE LP_USER (
    id VARCHAR(255) NOT NULL PRIMARY KEY DEFAULT (uuid()),
    contact_id VARCHAR(255) NOT NULL,
    prefecture_id VARCHAR(225) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(225),
    password VARCHAR(225),
    username VARCHAR(225),
    fullname VARCHAR(225),
    name_kanji VARCHAR(225),
    name_kana VARCHAR(225),
    birthday VARCHAR(225),
    address VARCHAR(225),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    UNIQUE(contact_id)
  );

CREATE TABLE LP_STORE (
    id VARCHAR(255) NOT NULL PRIMARY KEY DEFAULT (uuid()),
    contact_id VARCHAR(225) NOT NULL,
    prefecture_id VARCHAR(225) NOT NULL,
    store_key VARCHAR(255) unique,
    store_name VARCHAR(255),
    store_name_kana VARCHAR(255),
    owner VARCHAR(255),
    zip_code VARCHAR(255),
    phone VARCHAR(255),
    reject_reason VARCHAR(255),
    status VARCHAR(255),
    remark VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    UNIQUE(contact_id)
  );

CREATE TABLE LP_SELLER (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    contact_id VARCHAR(225) NOT NULL,
    prefecture_id VARCHAR(225),
    store_id VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(225),
    password VARCHAR(225),
    office_name  VARCHAR(225),
    office_name_kana  VARCHAR(225),
    post_code VARCHAR(225),
    address VARCHAR(225),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_seller_id_user FOREIGN KEY (id) REFERENCES LP_USER (id),
    CONSTRAINT fk_store_id_seller FOREIGN KEY (store_id) REFERENCES LP_STORE (id),

    UNIQUE(contact_id)
  );

CREATE TABLE LP_BUYER (
    id VARCHAR(255) NOT NULL,
    store_id VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(225),
    password VARCHAR(225),
    username VARCHAR(225),
    fullname VARCHAR(225),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_buyer_id_user FOREIGN KEY (id) REFERENCES LP_USER (id),
    CONSTRAINT fk_store_id_buyer FOREIGN KEY (store_id) REFERENCES LP_STORE (id),

    PRIMARY KEY(id, store_id)
  );

CREATE TABLE LP_PRODUCT (
    id VARCHAR(255) NOT NULL PRIMARY KEY DEFAULT (uuid()),
    store_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255),
    product_tag VARCHAR(255),
    product_type VARCHAR(255),
    stock VARCHAR(255),
    price VARCHAR(255),
    status VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,



    CONSTRAINT fk_store_id_product FOREIGN KEY (store_id) REFERENCES LP_STORE (id)
  );

CREATE TABLE LP_CATEGORY (
    id VARCHAR(255) NOT NULL PRIMARY KEY DEFAULT (uuid()),
    store_id VARCHAR(255) NOT NULL,
    parent_id VARCHAR(255),
    category_name VARCHAR(255),
    category_tag VARCHAR(255),
    status VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,


    CONSTRAINT fk_store_id_category FOREIGN KEY (store_id) REFERENCES LP_STORE (id)
  );
