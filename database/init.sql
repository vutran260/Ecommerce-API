CREATE EXTENSION IF NOT EXISTS "uuid-ossp";



CREATE TABLE admin
(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR,
    phone       VARCHAR,
    password    VARCHAR,
    username    VARCHAR,
    fullname    VARCHAR,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    deleted_at  TIMESTAMP
);

CREATE TABLE seller
(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR,
    phone       VARCHAR,
    password    VARCHAR,
    username    VARCHAR,
    fullname    VARCHAR,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    deleted_at  TIMESTAMP
);

CREATE TABLE store (
    id          UUID PRIMARY KEY,
    store_name  VARCHAR,
    status      VARCHAR,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    deleted_at  TIMESTAMP,

    CONSTRAINT fk_seller_id_store FOREIGN KEY (id) REFERENCES seller (id)

);

CREATE TABLE buyer
(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR,
    phone       VARCHAR,
    password    VARCHAR,
    username    VARCHAR,
    fullname    VARCHAR,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    deleted_at  TIMESTAMP
);

