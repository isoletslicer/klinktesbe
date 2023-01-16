## Endpoints

List of Available Endpoints:

- `POST /login`
- `POST /register`
- `GET /products`
- `POST /products`
- `POST /products/add-to-carts`
- `PATCH /products/checkouts`

### POST /register

Request:

- body:

```json
{
  "username": "string",
  "password": "string"
}
```

_Response (201 - Created)_

```json
{
  "message": "user with email <email> has been created"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email cannot be null"
}
OR
{
  "message": "Email cannot be empty"
}
OR
{
  "message": "Email value should be email format (using @)"
}
OR
{
  "message": "password cannot be null"
}
OR
{
  "message": "password cannot be empty"
}
OR
{
  "message": "Password must be at least 5 character"
}
```

&nbsp;

### POST /login

Request:

- body:

```json
{
  "username": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string"
}
```

_Response (401 - invalid email/password)_

```json
{
  "message": "error invalid username  or password"
}
```

&nbsp;

### GET /products

#### Description

- Get all product data.

#### Request

- Headers

```json
  {
    "access_token":String

  }
```

#### Response

_200 - OK_

- Body

  ```json
  {
    "products": [{
        "name":String,
        "price":Integer,
        "stock":Integer
    },
    ...
    ]
  },
  ```

_400 - Bad Request_

### POST /products

#### Description

- Add new product data

#### Request

- Headers

```json
  {
    "access_token":String

  }
```

- Body

  ```json
  {
    "name": String,
    "price": Integer,
    "stock": Integer,

  }
  ```

#### Response

_201 - Created_

- Body

  ```json
  { "message": `new Product ${name} with price ${price} and stock of ${stock} created. ` }
  ```

_400 - Bad Request_

- Body

  ```json
  { "message": "Failed to add item, please fill completely" }
  ```

### POST /products/add-to-carts

#### Description

- Add product data to cart

#### Request

- Headers

```json
  {
    "access_token":String

  }
```

- Body

  ```json
  {
    "name": String,
    "stock": Integer,
  }
  ```

#### Response

_201 - Created_

- Body

  ```json
  { "message": `Cart user ${username} with products ${req.body.name} qty ${req.body.stock} listed` }
  ```

_400 - Bad Request_

- Body

  ```json
  { "message": "Failed to add item, please fill completely" }
  ```

_404 - Not Found_

- Body

  ```json
  { "message": "Sorry, product not found" }
  ```

### PATCH /products/checkouts

#### Description

- Decrease the product stock from redis cache

#### Request

- Headers

```json
  {
    "access_token":String

  }
```

#### Response

_200 - OK_

- Body

  ```json
  {
  "message": `Checkout completed`,
  "products": [{
    "name" : String,
    "decrementedStock" : Integer,
    "price": Integer
  },
  ...
  ],
  "totalPrice": Integer
  }
  ```

_400 - Bad Request_

- Body

```json
{ "message": "Sorry, Stock not enough to decrease" }
```

_404 - Not Found_

- Body

  ```json
  { "message": "Sorry, product not found" }
  ```

### Global Error

#### Response

_400 - SequelizeValidationError_ \
OR \
_400 - SequelizeUniqueConstraintError_ \
OR \
_401 - Unauthorized Activity_ \
OR \
_500 - Internal Server error_
