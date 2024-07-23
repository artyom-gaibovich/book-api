# 📖 Book API Application

## Local deployment

----------------------------------------------
- npm i
- make up  | docker-compose up -d --build
- npm run build
- npm run start (prod.)
- npm run dev (dev.)
----------------------------

Use this JWT token,for creating user and then you can change roles.

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6W3sidXNlcl9pZCI6MjMsInJvbGVfdmFsdWUiOiJBRE1JTiJ9XSwidXNlcm5hbWUiOiJnZ2ZkZ2RnZCIsImlhdCI6MTcyMTY5ODMzOX0.Dk8oW_E1ZhxqQCxSM3osarusXjNJ1B8t3Iz0QFLYUsU

When you will make migrations, use  PG_HOST=postgresql

## API Documentation

## 1. Add a Book
- **HTTP Method:** POST
- **Endpoint:** `/books`
- **Request Body:** JSON with fields `title`, `author`, `publicationDate`, `genres`
- **Response:** JSON with the added book's data
- **Authentication Required:** Yes (only for users with the role "administrator")
- **Example**
```http request
POST http://localhost:8000/books/
```
Request Body:
```json
{
  "publicationDate": "2024-07-23T14:30:00+03:00",
  "author" : "Artyom_gaibovich",
  "title" : "book-api",
  "genres" : ["backend", "frontend", "devops"]
}
```
Response:
```json
{
  "_id": "669f27bbc4d82a7f4822c67c",
  "title": "book-api",
  "author": "Artyom_gaibovich",
  "publicationDate": "2024-07-23T14:30:00+03:00",
  "genres": [
    "backend",
    "frontend",
    "devops"
  ]
}
```
## 2. Get List of Books
- **HTTP Method:** GET
- **Endpoint:** `/books`
- **Response:** JSON array with data of all books
```http request
GET http://localhost:8000/books/669f25c9d130d3d3db3cb8e1
```
Response:
```json
{
  "books": [
    {
      "_id": "669f25c9d130d3d3db3cb8e1",
      "title": "book-api",
      "author": "Artyom_gaibovich",
      "publicationDate": "2024-07-23T14:30:00+03:00",
      "genres": [
        "backend",
        "frontend",
        "devops"
      ]
    },
    {
      "_id": "669f26c129b3a65a0f53740f",
      "title": "book-api",
      "author": "Artyom_gaibovich",
      "publicationDate": "2024-07-23T14:30:00+03:00",
      "genres": [
        "backend",
        "frontend",
        "devops"
      ]
    },
    {
      "_id": "669f27bbc4d82a7f4822c67c",
      "title": "book-api",
      "author": "Artyom_gaibovich",
      "publicationDate": "2024-07-23T14:30:00+03:00",
      "genres": [
        "backend",
        "frontend",
        "devops"
      ]
    }
  ]
}
```
## 3. Get a Book by ID
- **HTTP Method:** GET
- **Endpoint:** `/books/:id`
- **Response:** JSON with the book's data
```http request
GET http://localhost:8000/books/669f25c9d130d3d3db3cb8e1
```
Response:
```json
{
  "_id": "669f25c9d130d3d3db3cb8e1",
  "title": "book-api",
  "author": "Artyom_gaibovich",
  "publicationDate": "31-14-15",
  "genres": [
    "backend",
    "frontend",
    "devops"
  ]
}
```
## 4. Update Book Information
- **HTTP Method:** PUT
- **Endpoint:** `/books/:id`
- **Request Body:** JSON with fields `title`, `author`, `publicationDate`, `genres`
- **Response:** JSON with the updated book's data
- **Authentication Required:** Yes (only for users with the role "administrator")
```http request
PUT http://localhost:8000/books/669f25c9d130d3d3db3cb8e1
```
Request:
```json
{
  "title": "book-api",
  "author": "Artyom_gaibovich",
  "publicationDate": "31-14-15",
  "genres": [
    "Backend",
    "Frontend",
    "Devops"
  ]
}
```
Response:
```json
{
  "_id": "669f25c9d130d3d3db3cb8e1",
  "title": "book-api",
  "author": "Artyom_gaibovich",
  "publicationDate": "31-14-15",
  "genres": [
    "Backend",
    "Frontend",
    "DevOps"
  ]
}
```


## 5. Delete a Book
- **HTTP Method:** DELETE
- **Endpoint:** `/books/:id`
- **Authentication Required:** Yes (only for users with the role "administrator")
```http request
PUT http://localhost:8000/books/669f25c9d130d3d3db3cb8e1
```
Request:
```json

```

## 6. Register a User
- **HTTP Method:** POST
- **Endpoint:** `/users/register`
- **Request Body:** JSON with fields `username`, `password`, `email`
- **Email Confirmation:** Required
- **Response:** JSON with the registered user's data
- **Example**
- 
```http request
POST http://localhost:8000/users/register
```
Request Body:
```json
{
  "password" : "Artyom_gaibovich",
  "email" : "example@mail.ru",
  "username" : "ArtyomGaibovich"
}
```
Response:
```json
{
  "username": "ArtyomGaibovich",
  "email": "example@mail.ru",
  "id": 28
}
```

## 7. Authenticate a User
- **HTTP Method:** POST
- **Endpoint:** `/users/login`
- **Request Body:** JSON with fields `username`, `password`
- **Response:** JSON with a JWT token
- **Example**
```http request
POST http://localhost:8000/users/login
```
Request Body:
```json
{
  "password" : "21312sfdfsd3sdggdgdsdasd312",
  "username" : "ggfdgdgd"
}
```
Response:
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6W3sidXNlcl9pZCI6MjMsInJvbGVfdmFsdWUiOiJBRE1JTiJ9LHsidXNlcl9pZCI6MjMsInJvbGVfdmFsdWUiOiJVU0VSIn1dLCJ1c2VybmFtZSI6ImdnZmRnZGdkIiwiaWF0IjoxNzIxNzA1NDQyfQ.Q4H72AXD3jKidVatO7VieNmbhxw5x2YGvHXZIBjmGfM"
}
```

## 8. Get Current User Information
- **HTTP Method:** GET
- **Endpoint:** `/users/me`
- **Response:** JSON with the current user's data
- **Authentication Required:** Yes
- **Example**
```http request
GET http://localhost:8000/users/me
```
Response:
```json
{
  "username": "Artyom Gaibovich",
  "email": "example@gmail.com",
  "id": 23,
  "roles": [
    "ADMIN"
  ]
}
```

## 9. Change User Role
- **HTTP Method:** PUT
- **Endpoint:** `/users/:id/role`
- **Request Body:** JSON with the field `roles` (roles should be `ADMIN` or `USER`)
- **Response:** JSON with the updated user's data
- **Example**
```http request
PUT http://localhost:8000/users/23/role/
```
Request Body:
```json
{
    "roles" : ["ADMIN", "USER"]
}
```
Response:
```json
{
    "userId": "23",
    "roles": [
        {
            "user_id": 23,
            "role_value": "ADMIN"
        },
        {
            "user_id": 23,
            "role_value": "USER"
        }
    ]
}
```