CREATE EXTENSION IF NOT EXISTS "uuid-ossp";



CREATE TABLE admins
(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR,
    phone       VARCHAR,
    password    VARCHAR,
    username    VARCHAR,
    fullname    VARCHAR,
    image_url   TEXT,
    reset_token TEXT,
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP,
    deleted_at  TIMESTAMP
);

CREATE TABLE users
(
    id                   VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name            VARCHAR,
    gender               VARCHAR          DEFAULT NULL,
    date_of_birth        TIMESTAMP,
    email                VARCHAR,
    status               VARCHAR,
    phone                VARCHAR,
    fcm_token            TEXT,
    password             VARCHAR,
    created_at           TIMESTAMP,
    updated_at           TIMESTAMP,
    deleted_at           TIMESTAMP
);

