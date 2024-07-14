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
    product_image VARCHAR(2000) NOT NULL,
    product_description VARCHAR(2000) NOT NULL,
    product_overview VARCHAR(2000) NOT NULL,

    


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
    UNIQUE(product_id,component_name),
    CONSTRAINT fk_product_id_component FOREIGN KEY (product_id) REFERENCES LP_PRODUCT (id)
  );

CREATE TABLE LP_PRODUCT_FAQ (
    id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    question VARCHAR(100) NOT NULL,
    answer VARCHAR(100) NOT NULL,
    CONSTRAINT fk_product_id_faq FOREIGN KEY (product_id) REFERENCES LP_PRODUCT (id)
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

CREATE TABLE LP_STORE_NOTIFICATION (


  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  store_id VARCHAR(36) NOT NULL,
  notification_image VARCHAR(2000) NOT NULL,
  title TINYTEXT NOT NULL,
  details TEXT NOT NULL,
  status VARCHAR(255),

  CONSTRAINT FOREIGN KEY (store_id) REFERENCES LP_STORE(id)

  );


CREATE TABLE LP_PREFECTURES (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  prefecture_name CHAR(225)
);
SET NAMES utf8;

INSERT INTO LP_PREFECTURES (prefecture_name)
VALUES
('北海道'),
('青森県'),
('岩手県'),
('宮城県'),
('秋田県'),
('山形県'),
('福島県'),
('茨城県'),
('栃木県'),
('群馬県'),
('埼玉県'),
('千葉県'),
('東京都'),
('神奈川県'),
('新潟県'),
('富山県'),
('石川県'),
('福井県'),
('山梨県'),
('長野県'),
('岐阜県'),
('静岡県'),
('愛知県'),
('三重県'),
('滋賀県'),
('京都府'),
('大阪府'),
('兵庫県'),
('奈良県'),
('和歌山県'),
('鳥取県'),
('島根県'),
('岡山県'),
('広島県'),
('山口県'),
('徳島県'),
('香川県'),
('愛媛県'),
('高知県'),
('福岡県'),
('佐賀県'),
('長崎県'),
('熊本県'),
('大分県'),
('宮崎県'),
('鹿児島県'),
('沖縄県');

