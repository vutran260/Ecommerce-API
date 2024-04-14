CREATE TABLE  LP_ADMIN (
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

INSERT INTO LP_ADMIN
(email, phone, password, username, fullname)
VALUES( 'email', 'phone', 'password', 'username', 'fullname');

CREATE TABLE LP_USER (
    id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    contact_id VARCHAR(36) NOT NULL,
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
    id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
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
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    contact_id VARCHAR(225) NOT NULL,
    prefecture_id VARCHAR(225),
    store_id VARCHAR(36),
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
    id VARCHAR(36) NOT NULL,
    store_id VARCHAR(36) NOT NULL,
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
    id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    store_id VARCHAR(36) NOT NULL,

    is_subscription TINYINT NOT NULL,
    buying_time_option VARCHAR(255),
    buying_period VARCHAR(255),

    is_recomend TINYINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(512) NOT NULL,
    product_description VARCHAR(512) NOT NULL,

    capacity VARCHAR(255),
    expiration_use_date VARCHAR(255),
    storage_method VARCHAR(255),
    intake_method VARCHAR(255),

    ingredient VARCHAR(255),
    ## component
    notification_number VARCHAR(255),
    notification VARCHAR(255),

    has_option TINYINT NOT NULL,


    price DECIMAL(10, 4),
    price_before_discount DECIMAL(10, 4),
    cost DECIMAL(10, 4),
    stock_item INTEGER,

    product_tag VARCHAR(255),
    status VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,



    CONSTRAINT fk_store_id_product FOREIGN KEY (store_id) REFERENCES LP_STORE (id)
  );

CREATE TABLE LP_PRODUCT_COMPONENT (
    id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 4) NOT NULL,
    unit VARCHAR(255),

    CONSTRAINT fk_product_id_component FOREIGN KEY (product_id) REFERENCES LP_PRODUCT (id)
  );

CREATE TABLE LP_PRODUCT_OPTION (
    product_id VARCHAR(36) NOT NULL,
    option_type VARCHAR(72) NOT NULL,
    option_value VARCHAR(255) NOT NULL,
    option_order INTEGER NOT NULL,

    CONSTRAINT fk_product_id_option FOREIGN KEY (product_id) REFERENCES LP_PRODUCT (id),

    PRIMARY KEY (product_id, option_type)
);


CREATE TABLE LP_PRODUCT_OPTION_PRICE (
    product_id VARCHAR(36) NOT NULL,
    option_value_1 VARCHAR(72) NOT NULL,
    option_value_2 VARCHAR(72),
    option_value_3 VARCHAR(72),


    price DECIMAL(10, 4) NOT NULL,
    price_before_discount DECIMAL(10, 4),
    cost DECIMAL(10, 4) NOT NULL,
    stock_item INTEGER NOT NULL,


    CONSTRAINT fk_product_id_option_price FOREIGN KEY (product_id) REFERENCES LP_PRODUCT (id),

    PRIMARY KEY (product_id, option_value_1, option_value_2, option_value_3)
);


CREATE TABLE LP_CATEGORY (
    id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    store_id VARCHAR(36) NOT NULL,
    parent_id VARCHAR(36),
    category_name VARCHAR(255),
    category_tag VARCHAR(255),
    status VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,


    CONSTRAINT fk_store_id_category FOREIGN KEY (store_id) REFERENCES LP_STORE (id)
  );
