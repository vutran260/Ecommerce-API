# LINK_PALETTE Payment

## 1. Database degisn

### 1.1 Database relationships
```mermaid
erDiagram

    LP_BUYER{
        string id PK
        string email
        string phone
        string password
        string username
        string fullname
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    LP_STORE{
        string id PK
        string contract_id UK
        string store_key UK
        string store_name
        string store_name_kana
        string owner
        string zip_code
        string phone
        string reject_reason
        string status
        string remark
        datetime created_at
        datetime updated_at
        datetime deleted_at     
    }

    LP_ORDER{
        string id PK
        string buyer_id FK
        string store_id FK
        string order_receiver_id FK
        string order_shipment_id FK
        string order_payment_id FK
        int order_status
        number total_order_item_fee 
        number shipment_fee
        number total_fee
        datetime order_payment_datetime
        datetime order_shipment_start_datetime
        datetime order_shipment_end_datetime
        datetime order_cancel_datetime
        datetime order_created_at
        string order_created_by
        datetime order_updated_at
        string order_updated_by
    }

    LP_ORDER_ITEM{
        string id PK
        string order_id FK
        number buying_period
        string is_discount
        string discount_percentage
        string has_discount_schedule
        datetime discount_time_from
        datetime discount_time_to
        string product_name
        string product_image
        string product_description
        string capacity
        datetime expiration_use_date
        string storage_method
        string intake_method
        string ingredient
        string notification_number
        string notification
        boolean has_option
        number price
        number price_subscription
        number cost
        string product_tag
        string status
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    LP_ORDER_PAYMENT{
        string id PK
        string order_id FK
        int payment_type 
        int payment_status
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    LP_STORE_ADDRESS{
        string id PK
        string store_id FK
        string store_name
        string store_name_kana
        string owner
        string zip_code
        string phone
        string city
        string ward
        string town
        string village
        datetime created_at
        string created_by
        datetime updated_at
        string updated_by
        datetime deleted_at
    }

    LP_SHIPMENT{
        string id PK
        string order_id FK
        number shipment_fee
        number shipment_fee_discount
        datetime shipment_date
        string shipment_by
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    LP_SHIPMENT_HISTORY{
        string id PK
        string shipment_id FK
        datetime shipment_history_date
        int shipment_status
        string shipment_description
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    LP_PRODUCT{
        string id PK
        string store_id FK
        boolean is_subscription
        string buying_period
        boolean is_discount
        string discount_percentage
        boolean has_discount_schedule
        datetime discount_time_from
        datetime discount_time_to
        boolean is_recommend
        string product_name
        string product_image
        string product_description
        string capacity
        datetime expiration_use_date
        string storage_method
        string intake_method
        string ingredient
        string notification_number
        string notification
        boolean has_option
        number price
        number price_subscription
        number cost
        string stock_item
        string product_tag
        string status
        int quantity 
        boolean is_deleted
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    LP_ITEM_SUBSCRIPTION{
        string id PK
        string product_id FK
        string order_id FK
    }

    LP_BUYER_ADDRESS{
        string id PK
        string buyer_id FK
        string first_name
        string last_name
        string gender
        int postal_code
        string city
        string ward
        string town
        string village
        string block
        string email_address
        string phone_number
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    LP_STORE_PICKUP_ADDRESS{
        string id PK
        string order_id FK
        string store_address_id FK
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    LP_BUYER ||--|{ LP_BUYER_ADDRESS: HAS
    LP_ORDER ||--|| LP_BUYER_ADDRESS : HAS
    LP_ORDER ||--|| LP_ORDER_PAYMENT : HAS
    LP_ORDER ||--o| LP_STORE_PICKUP_ADDRESS: HAS
    LP_ORDER ||--o{ LP_ORDER_ITEM : HAS
    LP_ORDER_ITEM }|--|{ LP_ITEM_SUBSCRIPTION: HAS
    LP_STORE ||--|{ LP_ORDER : HAS
    LP_STORE ||--|{ LP_STORE_ADDRESS: HAS
    LP_STORE_ADDRESS }|--|{ LP_STORE_PICKUP_ADDRESS: HAS
    LP_STORE ||--o{ LP_PRODUCT: HAS
    LP_PRODUCT }|--|{ LP_ITEM_SUBSCRIPTION: HAS
    LP_ORDER ||--|| LP_SHIPMENT: HAS
    LP_SHIPMENT ||--o{ LP_SHIPMENT_HISTORY: HAS

```
### 1.2 Detail
#### LP_BUYER (Existed)
#### LP_STORE (Existed) 
#### LP_ORDER (Create new)
| id  | column_name                 | data_type  | notes                             |
|-----|-----------------------------|------------|-----------------------------------|
| 1   | id                          | VARCHAR(255) | PRIMARY KEY                      |
| 2   | buyer_id                    | VARCHAR(255) | FOREIGN KEY (LP_BUYER.id)        |
| 3   | store_id                    | VARCHAR(255) | FOREIGN KEY (LP_STORE.id)        |
| 4   | order_receiver_id           | VARCHAR(255) |                                   |
| 5   | order_shipment_id           | VARCHAR(255) |                                   |
| 6   | order_payment_id            | VARCHAR(255) |                                   |
| 7   | order_status                | INT         |            Order Statuses                       |
| 8   | total_order_item_fee        | DECIMAL(10, 2) |                                |
| 9   | shipment_fee                | DECIMAL(10, 2) |                                |
| 10  | total_fee                   | DECIMAL(10, 2) |                                |
| 11  | order_payment_datetime      | DATETIME     |                                |
| 12  | order_shipment_start_datetime | DATETIME     |                             |
| 13  | order_shipment_end_datetime | DATETIME     |                                |
| 14  | order_cancel_datetime       | DATETIME     |                                |
| 15  | order_created_at            | DATETIME     |                                |
| 16  | order_created_by            | VARCHAR(255) |                                |
| 17  | order_updated_at            | DATETIME     |                                |
| 18  | order_updated_by            | VARCHAR(255) |                                |

##### Order Statuses

| Status Code | Status     | Description                    |
|-------------|------------|--------------------------------|
| 0           | Pending    | The order is pending processing|
| 1           | Confirmed  | The order has been confirmed   |
| 2           | Shipped    | The order has been shipped     |
| 3           | Delivered  | The order has been delivered   |
| 4           | Cancelled  | The order has been cancelled   |
| 5           | Returned   | The order has been returned    |


#### LP_ORDER_ITEM (Create new)
| id  | column_name         | data_type  | notes                           |
|-----|---------------------|------------|---------------------------------|
| 1   | id                  | VARCHAR(255) | PRIMARY KEY                    |
| 2   | order_id            | VARCHAR(255) | FOREIGN KEY (LP_ORDER.id)      |
| 3   | buying_period       | INT         |                                 |
| 4   | is_discount         | VARCHAR(10) |                                 |
| 5   | discount_percentage | VARCHAR(10) |                                 |
| 6   | has_discount_schedule | VARCHAR(10) |                               |
| 7   | discount_time_from  | DATETIME    |                                 |
| 8   | discount_time_to    | DATETIME    |                                 |
| 9   | product_name        | VARCHAR(255) |                                |
| 10  | product_image       | TEXT        |                                 |
| 11  | product_description | TEXT        |                                 |
| 12  | capacity            | VARCHAR(50) |                                 |
| 13  | expiration_use_date | DATETIME    |                                 |
| 14  | storage_method      | VARCHAR(255) |                                |
| 15  | intake_method       | VARCHAR(255) |                                |
| 16  | ingredient          | TEXT        |                                 |
| 17  | notification_number | VARCHAR(255) |                                |
| 18  | notification        | TEXT        |                                 |
| 19  | has_option          | BOOLEAN     |                                 |
| 20  | price               | DECIMAL(10, 2) |                                |
| 21  | price_subscription  | DECIMAL(10, 2) |                                |
| 22  | cost                | DECIMAL(10, 2) |                                |
| 23  | product_tag         | VARCHAR(255) |                                |
| 24  | status              | VARCHAR(50)  |                                |
| 25  | created_at          | DATETIME    |                                 |
| 26  | updated_at          | DATETIME    |                                 |
| 27  | deleted_at          | DATETIME    |                                 |

#### LP_ORDER_PAYMENT (Create new)
| id  | column_name    | data_type  | notes                          |
|-----|----------------|------------|--------------------------------|
| 1   | id             | VARCHAR(255) | PRIMARY KEY                   |
| 2   | order_id       | VARCHAR(255) | FOREIGN KEY (LP_ORDER.id)     |
| 3   | payment_type   | INT         |             Payment Types      |
| 4   | payment_status | INT         |          Payment Statuses      |
| 5   | created_at     | DATETIME    |                                |
| 6   | updated_at     | DATETIME    |                                |
| 7   | deleted_at     | DATETIME    |                                |

##### Payment Statuses

| Status Code | Status          | Description                      |
|-------------|-----------------|----------------------------------|
| 0           | Pending         | Payment is pending processing    |
| 1           | Authorized      | Payment has been authorized      |
| 2           | Paid            | Payment has been successfully made |
| 3           | Partially Paid  | Partial payment has been made    |
| 4           | Failed          | Payment attempt has failed       |
| 5           | Refunded        | Payment has been refunded        |
| 6           | Cancelled       | Payment has been cancelled       |

##### Payment Types

| Type Code | Type               | Description                             |
|-----------|--------------------|-----------------------------------------|
| 0         | Credit Card        | Payment made using a credit card         |
| 1         | Debit Card         | Payment made using a debit card          |
| 2         | Bank Transfer      | Payment made via bank transfer           |
| 3         | PayPal             | Payment made via PayPal                 |
| 4         | Cash on Delivery   | Payment made upon delivery of goods      |
| 5         | Mobile Payment     | Payment made via mobile payment service  |
| 6         | Gift Card          | Payment made using a gift card           |


#### LP_STORE_ADDRESS (Create new)
| id  | column_name     | data_type  | notes                           |
|-----|-----------------|------------|---------------------------------|
| 1   | id              | VARCHAR(255) | PRIMARY KEY                    |
| 2   | store_id        | VARCHAR(255) | FOREIGN KEY (LP_STORE.id)      |
| 3   | store_name      | VARCHAR(255) |                                |
| 4   | store_name_kana | VARCHAR(255) |                                |
| 5   | owner           | VARCHAR(255) |                                |
| 6   | zip_code        | VARCHAR(20)  |                                |
| 7   | phone           | VARCHAR(50)  |                                |
| 8   | city            | VARCHAR(255) |                                |
| 9   | ward            | VARCHAR(255) |                                |
| 10  | town            | VARCHAR(255) |                                |
| 11  | village         | VARCHAR(255) |                                |
| 12  | created_at      | DATETIME     |                                |
| 13  | created_by      | VARCHAR(255) |                                |
| 14  | updated_at      | DATETIME     |                                |
| 15  | updated_by      | VARCHAR(255) |                                |
| 16  | deleted_at      | DATETIME     |                                |

#### LP_SHIPMENT (Create new)
| id  | column_name         | data_type  | notes                           |
|-----|---------------------|------------|---------------------------------|
| 1   | id                  | VARCHAR(255) | PRIMARY KEY                    |
| 2   | order_id            | VARCHAR(255) | FOREIGN KEY (LP_ORDER.id)      |
| 3   | shipment_fee        | DECIMAL(10, 2) |                                |
| 4   | shipment_fee_discount | DECIMAL(10, 2) |                             |
| 5   | shipment_date       | DATETIME    |                                 |
| 6   | shipment_by         | VARCHAR(255) |                                |
| 7   | created_at          | DATETIME    |                                 |
| 8   | updated_at          | DATETIME    |                                 |
| 9   | deleted_at          | DATETIME    |                                 |

#### LP_SHIPMENT_HISTORY (Create new)
| id  | column_name           | data_type  | notes                          |
|-----|-----------------------|------------|--------------------------------|
| 1   | id                    | VARCHAR(255) | PRIMARY KEY                   |
| 2   | shipment_id           | VARCHAR(255) | FOREIGN KEY (LP_SHIPMENT.id)  |
| 3   | shipment_history_date | DATETIME    |                                |
| 4   | shipment_status       | INT         |                                |
| 5   | shipment_description  | TEXT        |                                |
| 6   | created_at            | DATETIME    |                                |
| 7   | updated_at            | DATETIME    |                                |
| 8   | deleted_at            | DATETIME    |                                |

#### LP_PRODUCT (Existed) 
| id  | column_name         | data_type  | notes                           |
|-----|---------------------|------------|---------------------------------|
| 1   | id                  | VARCHAR(255) | PRIMARY KEY                    |
| 2   | store_id            | VARCHAR(255) | FOREIGN KEY (LP_STORE.id)      |
| 3   | is_subscription     | BOOLEAN     |                                 |
| 4   | buying_period       | VARCHAR(50) |                                 |
| 5   | is_discount         | BOOLEAN     |                                 |
| 6   | discount_percentage | VARCHAR(10) |                                 |
| 7   | has_discount_schedule | BOOLEAN     |                               |
| 8   | discount_time_from  | DATETIME    |                                 |
| 9   | discount_time_to    | DATETIME    |                                 |
| 10  | is_recommend        | BOOLEAN     |                                 |
| 11  | product_name        | VARCHAR(255) |                                |
| 12  | product_image       | TEXT        |                                 |
| 13  | product_description | TEXT        |                                 |
| 14  | capacity            | VARCHAR(50) |                                 |
| 15  | expiration_use_date | DATETIME    |                                 |
| 16  | storage_method      | VARCHAR(255) |                                |
| 17  | intake_method       | VARCHAR(255) |                                |
| 18  | ingredient          | TEXT        |                                 |
| 19  | notification_number | VARCHAR(255) |                                |
| 20  | notification        | TEXT        |                                 |
| 21  | has_option          | BOOLEAN     |                                 |
| 22  | price               | DECIMAL(10, 2) |                                |
| 23  | price_subscription  | DECIMAL(10, 2) |                                |
| 24  | cost                | DECIMAL(10, 2) |                                |
| 25  | stock_item          | VARCHAR(255) |                                |
| 26  | product_tag         | VARCHAR(255) |                                |
| 27  | status              | VARCHAR(50)  |                                |
| 28  | quantity            | INT         |                                 |
| 29  | is_deleted          | BOOLEAN     |                                 |
| 30  | created_at          | DATETIME    |                                 |
| 31  | updated_at          | DATETIME    |                                 |
| 32  | deleted_at          | DATETIME    |                                 |

#### LP_ITEM_SUBSCRIPTION (Create new) 
| id  | column_name  | data_type  | notes                           |
|-----|--------------|------------|---------------------------------|
| 1   | id           | VARCHAR(255) | PRIMARY KEY                    |
| 2   | product_id   | VARCHAR(255) | FOREIGN KEY (LP_PRODUCT.id)    |
| 3   | order_id     | VARCHAR(255) | FOREIGN KEY (LP_ORDER.id)      |

#### LP_BUYER_ADDRESS (Existed)
| id  | column_name     | data_type  | notes                          |
|-----|-----------------|------------|--------------------------------|
| 1   | id              | VARCHAR(255) | PRIMARY KEY                   |
| 2   | buyer_id        | VARCHAR(255) | FOREIGN KEY (LP_BUYER.id)     |
| 3   | first_name      | VARCHAR(255) |                                |
| 4   | last_name       | VARCHAR(255) |                                |
| 5   | gender          | VARCHAR(10)  |                                |
| 6   | postal_code     | INT          |                                |
| 7   | city            | VARCHAR(255) |                                |
| 8   | ward            | VARCHAR(255) |                                |
| 9   | town            | VARCHAR(255) |                                |
| 10  | village         | VARCHAR(255) |                                |
| 11  | block           | VARCHAR(255) |                                |
| 12  | email_address   | VARCHAR(255) |                                |
| 13  | phone_number    | VARCHAR(50)  |                                |
| 14  | created_at      | DATETIME     |                                |
| 15  | updated_at      | DATETIME     |                                |
| 16  | deleted_at      | DATETIME     |                                |

#### LP_STORE_PICKUP_ADDRESS (Create new)
| id  | column_name      | data_type  | notes                          |
|-----|------------------|------------|--------------------------------|
| 1   | id               | VARCHAR(255) | PRIMARY KEY                   |
| 2   | order_id         | VARCHAR(255) | FOREIGN KEY (LP_ORDER.id)     |
| 3   | store_address_id | VARCHAR(255) | FOREIGN KEY (LP_STORE_ADDRESS.id) |
| 4   | created_at       | DATETIME     |                                |
| 5   | updated_at       | DATETIME     |                                |
| 6   | deleted_at       | DATETIME     |                                |


<!-- ### Database query
```
CREATE TABLE LP_ORDER (
    id VARCHAR(255) PRIMARY KEY,
    buyer_id VARCHAR(255),
    store_id VARCHAR(255),
    order_receiver_id VARCHAR(255),
    order_shipment_id VARCHAR(255),
    order_payment_id VARCHAR(255),
    order_status INT,
    total_order_item_fee DECIMAL(10, 2),
    shipment_fee DECIMAL(10, 2),
    total_fee DECIMAL(10, 2),
    order_payment_datetime DATETIME,
    order_shipment_start_datetime DATETIME,
    order_shipment_end_datetime DATETIME,
    order_cancel_datetime DATETIME,
    order_created_at DATETIME,
    order_created_by VARCHAR(255),
    order_updated_at DATETIME,
    order_updated_by VARCHAR(255),
    FOREIGN KEY (buyer_id) REFERENCES LP_BUYER(id),
    FOREIGN KEY (store_id) REFERENCES LP_STORE(id)
);

CREATE TABLE LP_ORDER_ITEM (
    id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255),
    buying_period INT,
    is_discount VARCHAR(10),
    discount_percentage VARCHAR(10),
    has_discount_schedule VARCHAR(10),
    discount_time_from DATETIME,
    discount_time_to DATETIME,
    product_name VARCHAR(255),
    product_image TEXT,
    product_description TEXT,
    capacity VARCHAR(50),
    expiration_use_date DATETIME,
    storage_method VARCHAR(255),
    intake_method VARCHAR(255),
    ingredient TEXT,
    notification_number VARCHAR(255),
    notification TEXT,
    has_option BOOLEAN,
    price DECIMAL(10, 2),
    price_subscription DECIMAL(10, 2),
    cost DECIMAL(10, 2),
    product_tag VARCHAR(255),
    status VARCHAR(50),
    created_at DATETIME,
    updated_at DATETIME,
    deleted_at DATETIME,
    FOREIGN KEY (order_id) REFERENCES LP_ORDER(id)
);

CREATE TABLE LP_ORDER_PAYMENT (
    id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255),
    payment_type INT,
    payment_status INT,
    created_at DATETIME,
    updated_at DATETIME,
    deleted_at DATETIME,
    FOREIGN KEY (order_id) REFERENCES LP_ORDER(id)
);

CREATE TABLE LP_STORE_ADDRESS (
    id VARCHAR(255) PRIMARY KEY,
    store_id VARCHAR(255),
    store_name VARCHAR(255),
    store_name_kana VARCHAR(255),
    owner VARCHAR(255),
    zip_code VARCHAR(20),
    phone VARCHAR(50),
    city VARCHAR(255),
    ward VARCHAR(255),
    town VARCHAR(255),
    village VARCHAR(255),
    created_at DATETIME,
    created_by VARCHAR(255),
    updated_at DATETIME,
    updated_by VARCHAR(255),
    deleted_at DATETIME,
    FOREIGN KEY (store_id) REFERENCES LP_STORE(id)
);

CREATE TABLE LP_SHIPMENT (
    id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255),
    shipment_fee DECIMAL(10, 2),
    shipment_fee_discount DECIMAL(10, 2),
    shipment_date DATETIME,
    shipment_by VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME,
    deleted_at DATETIME,
    FOREIGN KEY (order_id) REFERENCES LP_ORDER(id)
);

CREATE TABLE LP_SHIPMENT_HISTORY (
    id VARCHAR(255) PRIMARY KEY,
    shipment_id VARCHAR(255),
    shipment_history_date DATETIME,
    shipment_status INT,
    shipment_description TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    deleted_at DATETIME,
    FOREIGN KEY (shipment_id) REFERENCES LP_SHIPMENT(id)
);

CREATE TABLE LP_PRODUCT (
    id VARCHAR(255) PRIMARY KEY,
    store_id VARCHAR(255),
    is_subscription BOOLEAN,
    buying_period VARCHAR(50),
    is_discount BOOLEAN,
    discount_percentage VARCHAR(10),
    has_discount_schedule BOOLEAN,
    discount_time_from DATETIME,
    discount_time_to DATETIME,
    is_recommend BOOLEAN,
    product_name VARCHAR(255),
    product_image TEXT,
    product_description TEXT,
    capacity VARCHAR(50),
    expiration_use_date DATETIME,
    storage_method VARCHAR(255),
    intake_method VARCHAR(255),
    ingredient TEXT,
    notification_number VARCHAR(255),
    notification TEXT,
    has_option BOOLEAN,
    price DECIMAL(10, 2),
    price_subscription DECIMAL(10, 2),
    cost DECIMAL(10, 2),
    stock_item VARCHAR(255),
    product_tag VARCHAR(255),
    status VARCHAR(50),
    quantity INT,
    is_deleted BOOLEAN,
    created_at DATETIME,
    updated_at DATETIME,
    deleted_at DATETIME,
    FOREIGN KEY (store_id) REFERENCES LP_STORE(id)
);

CREATE TABLE LP_ITEM_SUBSCRIPTION (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255),
    order_id VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES LP_PRODUCT(id),
    FOREIGN KEY (order_id) REFERENCES LP_ORDER(id)
);

CREATE TABLE LP_BUYER_ADDRESS (
    id VARCHAR(255) PRIMARY KEY,
    buyer_id VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    gender VARCHAR(10),
    postal_code INT,
    city VARCHAR(255),
    ward VARCHAR(255),
    town VARCHAR(255),
    village VARCHAR(255),
    block VARCHAR(255),
    email_address VARCHAR(255),
    phone_number VARCHAR(50),
    created_at DATETIME,
    updated_at DATETIME,
    deleted_at DATETIME,
    FOREIGN KEY (buyer_id) REFERENCES LP_BUYER(id)
);

CREATE TABLE LP_STORE_PICKUP_ADDRESS (
    id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255),
    store_address_id VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME,
    deleted_at DATETIME,
    FOREIGN KEY (order_id) REFERENCES LP_ORDER(id),
    FOREIGN KEY (store_address_id) REFERENCES LP_STORE_ADDRESS(id)
);

``` -->

## 2. FLOW
### 2.1 PAYMENT FLOW

```mermaid
sequenceDiagram
    participant W AS EC_WEB
    participant SV AS EC_SERVER
    participant GG AS GMO_GATEWAY
    participant DB AS DATABASE

    W->>W: ENTER ORDER INFORMATION

    W->>W: SELECT CREDIT CARD
    W->> W: PRESS 'COMFIRM YOUR ORDER'
    W->> SV: SEND REQUEST TO PROCESS ORDER
    SV->> DB: SAVE ORDERS INFORMATION
    SV->>  GG:  REQUEST TO CHECK FRAUD
    NOTE RIGHT OF SV: SIFT API
    GG->> SV: RETURN CHECK POINT 
    rect rgb(255,255,0)
    NOTE RIGHT OF SV: Q&A nội bộ câu 17 ý số 5
    SV->> SV: VALIDATE ORDER BASE ON CHECK POINT
    END
    ALT DATA IS INVALID
        SV->>DB: UPDATE ORDER STATUS
        SV ->> W: PAYMENT GOT ERROR, PLEASE CHECK YOUR INFORMATION
    END

    SV->>DB: GET BUYER ,SELLER AND ORDER INFO,
    SV->> GG: SEND REQUEST TO CREATE TRANSACTION
    NOTE RIGHT OF SV: ASSUME USING PAYMENT WITHOUT SECURE API
    GG->> SV: RETURN TRANSACTION ID 
    SV->> GG: SEND REQUEST TO PROCESS PAYMENT
    GG->>SV: RETURN PAYMENT STATUS
    ALT IF PAYMENT GOT ERROR
        SV->>DB: UPDATE ORDER STATUS 
        SV->> W: RETURN MESSAGE ERORR
    END

    SV->>DB: UPDATE ORDER STATUS
    SV->> W: RETURN MESSAGE SUCCESS

```

### 2.2 CREDIT CARD FLOW
[1. ĐĂNG KÍ THÔNG TIN THẺ](https://docs.google.com/presentation/d/1F5zihH70pPHeQn99koyrDkblBSIR3tWA/edit#slide=id.p4)

```mermaid
sequenceDiagram
    participant W AS EC_WEB
    participant SV AS EC_SERVER
    participant GG AS GMO_GATEWAY
    participant LQ AS LINQ_SERVER

    W->>W: USER PRESS 'Proceed to order'
    W->>SV: REQUEST TO GET CARD LIST BY USER ID
    rect rgb(255,255,0)
    NOTE RIGHT OF SV: Q&A nội bộ câu 17 ý số 4
    SV->>LQ: REQUEST TO GET MEMBER ID
    LQ ->> SV: RETURN RESULT
    END
    SV->>GG: REQUEST SEARCH CARDS BY MEMBER ID
    GG->> SV: RETURN RESULT

    ALT IF GOT ERROR
        SV->>W: RETURN MESSAGE ERROR
    END

    ALT IF USER DO NOT REGISTRY GMO MEMBER YET
       SV->>GG: REQUEST TO REGISTRY MEMBER
       GG->>SV: RETURN RESULT
        ALT IF GOT ERROR
        SV->>W: RETURN MESSAGE ERROR
        END
       SV->>W: RETURN EMPTY LIST
    ELSE USER IS GMO MEMBER
       ALT  IF CARDS IS NOT EXISTED
       SV->>W: RETURN EMPTY LIST
       ELSE CARD IS EXISTED
       SV->>W: RETURN LIST CARDS
       END
    END

    NOTE RIGHT OF W : ADD CREDIT CARD
    ALT IF LIST CARDS IS EMPTY
        W->>W: ENTER THEIR CREDIT CARD
        W->>W: ENCRYPT CARD INFO
        W->>SV: REQUEST ADD CREDIT CARD
        SV->>GG: SAVE CREDIT CARD
        GG->>SV: RETURN RESULT
        ALT IF SAVE CREDIT CARD GOT ERROR
            SV->>W: RETURN MESSAGE ERROR
        ELSE SUCCESS
            SV->>W: RETURN LIST CARDS
        END
    END
```

```mermaid
---
title: Activity Diagram for Adding Credit Card Process
---
graph TD
    A[Start] --> B[User presses 'Proceed to order']
    B --> C[Request to get card list by user ID]
    C --> D[Request to get member ID]
    D --> E[Return result from LINQ server]
    E --> F[Request search cards by member ID]
    F --> G{Got error?}
    G -- Yes --> H[Return message error to user]
    G -- No --> I{User registered as GMO member?}
    I -- No --> J[Request to register member]
    J --> K[Return result from GMO gateway]
    K --> L{Got error?}
    L -- Yes --> H
    L -- No --> M[Return empty list to user]
    I -- Yes --> N{Cards exist?}
    N -- No --> M
    N -- Yes --> O[Return list of cards to user]
    M --> P{List of cards is empty?}
    O --> X
    P -- Yes --> Q[Enter credit card information]
    Q --> R[Encrypt card info]
    R --> S[Request to add credit card]
    S --> T[Save credit card to GMO gateway]
    T --> U[Return result from GMO gateway]
    U --> V{Save credit card got error?}
    V -- Yes --> H
    V -- No --> W[Return list of cards to user]
    W --> X[End]
    P -- No --> X

```

### API LIST

| Endpoint                  | Method | Description                         |
|---------------------------|--------|-------------------------------------|
| `/buyer_site/orders`             | GET    | Retrieve all orders                 |
| `/buyer_site/orders/:id`         | GET    | Retrieve a specific order           |
| `/buyer_site/orders`             | POST   | Create a new order                  |
| `/buyer_site/orders/:id`         | PUT    | Update a specific order             |
