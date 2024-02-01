CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE "LP_ADMIN"
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

CREATE TABLE "LP_USER"
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


CREATE TABLE "LP_STORE" (
    id          UUID PRIMARY KEY,
    store_key   VARCHAR unique,
    store_name  VARCHAR,
    status      VARCHAR,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    deleted_at  TIMESTAMP
);

CREATE TABLE "LP_SELLER"
(
    id          UUID PRIMARY KEY,
    store_id    UUID ,
    email       VARCHAR,
    phone       VARCHAR,
    password    VARCHAR,
    username    VARCHAR,
    fullname    VARCHAR,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    deleted_at  TIMESTAMP,

    CONSTRAINT fk_seller_id_user FOREIGN KEY (id) REFERENCES "LP_USER" (id),
    CONSTRAINT fk_store_id_seller FOREIGN KEY (store_id) REFERENCES "LP_STORE" (id)
);





CREATE TABLE "LP_BUYER"
(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR,
    phone       VARCHAR,
    password    VARCHAR,
    username    VARCHAR,
    fullname    VARCHAR,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    deleted_at  TIMESTAMP,

    CONSTRAINT fk_buyer_id_user FOREIGN KEY (id) REFERENCES "LP_USER" (id)
);

