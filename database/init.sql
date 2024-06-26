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


CREATE TABLE LP_STORE (
    id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    contract_id VARCHAR(225) NOT NULL,
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
    
    UNIQUE(contract_id)
  );

CREATE TABLE LP_SELLER (
    id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
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

    CONSTRAINT fk_store_id_seller FOREIGN KEY (store_id) REFERENCES LP_STORE (id)
  );

CREATE TABLE LP_BUYER (
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


CREATE TABLE LP_STORE_BUYER (
    store_id VARCHAR(36) NOT NULL,
    buyer_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FOREIGN KEY (store_id) REFERENCES LP_STORE (id),
    CONSTRAINT FOREIGN KEY (buyer_id) REFERENCES LP_BUYER (id),

    PRIMARY KEY (store_id, buyer_id)

);

CREATE TABLE LP_PRODUCT (
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


    price INT UNSIGNED NOT NULL,
    price_subscription INT UNSIGNED,
    cost INT UNSIGNED,
    stock_item INT UNSIGNED,

    product_tag VARCHAR(255),
    status VARCHAR(255),
    is_deleted TINYINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,



    CONSTRAINT fk_store_id_product FOREIGN KEY (store_id) REFERENCES LP_STORE (id)
  );

CREATE TABLE LP_PRODUCT_COMPONENT (
    id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    component_value VARCHAR(255) NOT NULL,
    component_name VARCHAR(255),
    UNIQUE(id,component_name),
    CONSTRAINT fk_product_id_component FOREIGN KEY (product_id) REFERENCES LP_PRODUCT (id)
  );

CREATE TABLE LP_PRODUCT_OPTION (
    product_id VARCHAR(36) NOT NULL,
    option_type VARCHAR(72) NOT NULL,
    option_value VARCHAR(255) NOT NULL,
    option_order INT UNSIGNED NOT NULL,

    CONSTRAINT fk_product_id_option FOREIGN KEY (product_id) REFERENCES LP_PRODUCT (id),

    PRIMARY KEY (product_id, option_type)
);


CREATE TABLE LP_PRODUCT_OPTION_PRICE (
    product_id VARCHAR(36) NOT NULL,
    option_value_1 VARCHAR(72) NOT NULL,
    option_value_2 VARCHAR(72),
    option_value_3 VARCHAR(72),


    price INT UNSIGNED NOT NULL,
    price_before_discount INT UNSIGNED,
    cost INT UNSIGNED NOT NULL,
    stock_item INT UNSIGNED NOT NULL,


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
    order_level INT(11) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,


    CONSTRAINT fk_store_id_category FOREIGN KEY (store_id) REFERENCES LP_STORE (id)
  );

CREATE TABLE LP_PRODUCT_CATEGORY (
  product_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(225),

  CONSTRAINT FOREIGN KEY (product_id) REFERENCES LP_PRODUCT (id),
  CONSTRAINT FOREIGN KEY (category_id) REFERENCES LP_CATEGORY (id),

  PRIMARY KEY (product_id, category_id)
);


CREATE TABLE LP_CART (
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

CREATE TABLE LP_ADDRESS_BUYER(
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

  CONSTRAINT fk_buyer_id FOREIGN KEY (buyer_id) REFERENCES LP_BUYER(id),
  CONSTRAINT fk_store_id FOREIGN KEY (store_id) REFERENCES LP_STORE(id)

);
