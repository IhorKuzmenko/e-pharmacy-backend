# E-Pharmacy Backend

RESTful API for an online pharmacy application, built with Node.js, Express.js, and MongoDB.

The backend provides product catalog management, pharmacy locations, customer reviews, user authentication, shopping cart functionality, and order checkout.

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — REST API framework
- **MongoDB Atlas** — Cloud database
- **Mongoose** — MongoDB object modeling
- **JWT (jsonwebtoken)** — Authentication
- **bcrypt** — Password hashing
- **Joi** — Request validation
- **CORS** — Cross-origin resource sharing
- **dotenv** — Environment configuration
- **Nodemon** — Development server
- **ESLint & Prettier** — Code quality and formatting

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Secure logout with token revocation
- Protected user profile endpoint
- Product catalog with search, filtering, and pagination
- Individual product details
- Pharmacy locations and nearest pharmacy listings
- Customer reviews
- User-specific shopping carts
- Add, update, and remove cart items
- Product stock validation
- Order checkout with MongoDB transactions
- Automatic stock updates after checkout
- Centralized error handling
- Health check endpoint

## Getting Started

### Prerequisites

Before running the project, make sure you have:

- Node.js installed
- npm installed
- A MongoDB Atlas database
- Git installed

### Installation

Clone the repository:

```bash
git clone https://github.com/IhorKuzmenko/e-pharmacy-backend.git
```

Navigate to the project directory:

```bash
cd e-pharmacy-backend
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

| Variable         | Description                     |
| ---------------- | ------------------------------- |
| `PORT`           | Port used by the API server     |
| `MONGODB_URI`    | MongoDB Atlas connection string |
| `JWT_SECRET`     | Secret key for signing JWTs     |
| `JWT_EXPIRES_IN` | JWT expiration time             |
| `NODE_ENV`       | Application environment         |

Never commit your actual `.env` file or credentials to GitHub.

### Running the Application

Start the development server:

```bash
npm run dev
```

The API will be available at:

`http://localhost:3000`

### Database Seeding

The project includes scripts for importing initial data into MongoDB.

```bash
npm run seed
```

Additional seed scripts may be used for customer reviews.

Run seed scripts only against the intended database. Review the scripts before running them in production.

## API Documentation

Base URL for local development:

`http://localhost:3000/api`

### Authentication

| Method | Endpoint         | Access | Description                           |
| ------ | ---------------- | ------ | ------------------------------------- |
| POST   | `/user/register` | Public | Register a new user                   |
| POST   | `/user/login`    | Public | Authenticate a user and receive a JWT |
|        |
