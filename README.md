# Video Management API

## Description

A RESTful API for managing videos, built with Node.js, Express, and Prisma. Supports JWT authentication with role-based access control (user/admin), CRUD operations on videos, pagination, and filtering.

## Features

- JWT-based authentication with role-based access control (user/admin)
- CRUD operations for videos
- Pagination and filtering (by genre, tag)
- PostgreSQL database with Prisma ORM
- Comprehensive API testing with Jest and Supertest
- Postman collection for easy API testing

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd video_management_api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/video_db"
   DIRECT_URL="postgresql://username:password@localhost:5432/video_db"
   JWT_SECRET_KEY="your_jwt_secret_key"
   ADMIN_TOKEN="your_admin_token"
   ```

4. Set up the database:
   ```
   npx prisma migrate dev
   npx prisma generate
   ```

## Usage

1. Start the development server:
   ```
   npm run dev
   ```
   The server will run on `http://localhost:3000`.

2. API Endpoints:

   ### Authentication
   - `GET /auth/accesstoken` - Generate user token
   - `GET /auth/accesstoken?role=admin&token=<ADMIN_TOKEN>` - Generate admin token

   ### Videos
   - `GET /videos` - Get videos (with pagination and filters: page, limit, genre, tag) - Requires user token
   - `POST /videos/add` - Add a new video - Requires admin token
   - `PUT /videos/:id` - Update a video - Requires admin token
   - `DELETE /videos/:id` - Delete a video - Requires admin token

   Use the Authorization header: `Bearer <token>`

## Testing

Run the test suite:
```
npm test
```

## Postman Collection

Import `Video_Management_API.postman_collection.json` into Postman for easy API testing. Set the `base_url` variable to `http://localhost:3000` and `ADMIN_TOKEN` to your admin token.

## Database Schema

The `video` model includes:
- id (Int, primary key)
- title (String)
- description (String, optional)
- duration (Int)
- genre (String, optional)
- tag (String[], array)
- createdAt (DateTime)
- updatedAt (DateTime)


## Author

[Adeosun Juwon Samuel]
