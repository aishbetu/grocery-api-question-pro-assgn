
# Grocery API Question Pro Assignment

This is a MVP Assignment for the Grocery App Api's. This project can be used with docker with no configurations required.


## Run Locally

Clone the project

```bash
  git clone https://github.com/aishbetu/grocery-api-question-pro-assgn.git
```

Go to the project directory

```bash
  cd grocery-api-question-pro-assgn-main
```

Start Docker Engine

```bash
  sudo systemctl start docker
```
Cofigure Docker compose file with mysql credentials

```bash
  go to docker-compose.yaml configure MYSql credentials
```

Start the server with docker compose

```bash
  docker-compose up --build
```
It will install all dependencies and intialise the MYSQL Database too in your docker container

## EndPoints

- Authorization Endpoints
Signup
```bash
  http://localhost:3000/auth/signup
  Method: POST
  Payload: {
    "username": "userBoy1661213",
    "password": "aish123",
    "email": "admin242@gmail.com",
    "full_name": "User Aish1",
    "role": "users"
}

Note: To Register as admin pass "role": "admin" in above payload.

```
Login
```bash
  http://localhost:3000/auth/login
  Method: POST
  Payload: {
    "username": "userBoy1661213",
    "password": "aish123",
    "role": "users"
}


Note: To Login as admin pass "role": "admin" in above payload. But you must have registered as admin then only it will work.

```
- Admin Endpoints

Add Grocery
```bash
  http://localhost:3000/admin/grocery-items
  Method: POST
  Headers: Authorization : <jwt token>
  FormData: {
    name: <Text>
    price: <Text>
    inventory: <Text>
    image: <file>
}


Note: In Body select form-data then pass these values to add a grocery. JWT of admin is required to access this endpoint.

```
Update Grocery
```bash
  http://localhost:3000/admin/grocery-items/:id
  Method: PUT
  Headers: Authorization : <jwt token>
  FormData: {
    name: <Text>
    price: <Text>
    inventory: <Text>
    image: <file>
}


Note: In Body select form-data then pass these values to add a grocery. JWT of admin is required to access this endpoint.

```
Get Groceries
```bash
  http://localhost:3000/admin/grocery-items
  Method: GET
  Headers: Authorization : <jwt token>


Note: JWT of admin is required to access this endpoint.

```
Manage Inventory
```bash
  http://localhost:3000/admin/inventory/:id
  Method: PATCH
  Headers: Authorization : <jwt token>
  Payload: {
    "inventory": 100
  }


Note: JWT of admin is required to access this endpoint.

```

Delete Grocery
```bash
  http://localhost:3000/admin/grocery-items/:id
  Method: DELETE
  Headers: Authorization : <jwt token>

Note: JWT of admin is required to access this endpoint.

```
- User Endpoints

Get Groceries
```bash
  http://localhost:3000/user/grocery-items
  Method: GET
  Headers: Authorization : <jwt token>

Note: JWT of users role is required to access this endpoint.

```

Book Groceries
```bash
  http://localhost:3000/user/book-items
  Method: POST
  Headers: Authorization : <jwt token>
  Payload: {
    "items": [
        {
            "itemId": "2", // grocery id
            "quantity": 2 // total number of quantities
        }
    ]
}

Note: JWT of users role is required to access this endpoint.

```

