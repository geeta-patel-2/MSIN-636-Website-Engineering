# 📈 Portfolio Management API

This is a Node.js and Express-based backend API for managing investment portfolios, accounts, user associations, and proposed trade sessions. It serves as the backend for a portfolio management application that enables users (including advisors and individuals) to track and manage assets, propose trades, and monitor holdings in real-time.

---

## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **dotenv** for environment configuration
- **bcrypt** for password hashing
- **jsonwebtoken** for authentication
- **uuid** for unique ID generation

---

## 🚀 How to Run the Project

### 1. Clone the repository

```bash
    git clone <your-repo-url>
    cd portfolio_management_api
````

### 2. Install dependencies

```bash 
  npm install
```

### 3. Set up environment variables

Rename the `.env.example` file to `.env` and update the necessary values. (See below)

### 4. Start the server

```bash
  npm start
```

The server will run on the port specified in your `.env` file.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/portfolio_management
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES_IN='3h'
```

Adjust values as needed for your environment.

---

## 📁 Project Structure

```plaintext
portfolio_management_api/
├── one_time_scripts/              # Scripts to prepopulate DB
├── src/
│   ├── config/                    # DB connection setup
│   ├── models/                    # Mongoose schema definitions
│   ├── routes/                    # All API route handlers
│   └── server.js                  # Main entry point
├── .env                           # Environment variables
├── package.json                   # Project metadata & dependencies
```

---

## 🧩 Data Models

### AccountHoldings

Represents holdings in a user’s investment account.

* Fields: `account_id`, `ticker_symbol`, `current_quantity`, `order_quantity`, `projected_quantity`, `gain_loss_value`, etc.

### OpenOrder

Stores open orders that haven't been executed yet.

* Fields: `user_id`, `account_id`, `order_quantity`, `order_market_value`

### ProposedOrderSession

A snapshot of a user’s proposed trading activity.

* Fields: `proposed_order_session_id`, `created_by`, `created_at`

### ProposedOrderSessionAccountHoldings

Details of proposed changes at the holding level.

* Fields: `holding_id`, `order_quantity`, `projected_market_value`, `gain_loss_value`

### ProposedOrderSessionAccounts

Account-level projection of value changes.

* Fields: `account_id`, `current_market_value`, `total_gain_loss_value`

### ticker\_symbols

Company metadata and market price information.

* Fields: `isin`, `cusip`, `ticker_symbol`, `company_name`, `current_price`

### Users

Login credentials and user type.

* Fields: `first_name`, `last_name`, `email_id`, `user_type`, `password`

### UserAccounts

Links individual users to their investment accounts.

* Fields: `individual_id`, `account_id`, `liquid_cash_amount`

### UserAssociations

Represents advisor-client relationships.

* Fields: `strategic_advisor_id`, `individual_id`, `check_box`

---

## 📡 API Routes

> All routes are defined in `src/routes/`. Below is a placeholder structure for you to fill in as needed.

### 🔐 Authentication API Routes
These routes handle user authentication, including registration and login. JWT tokens are issued upon successful login and should be used for accessing protected routes.

| Method | Endpoint    | Description                                                                                                                   |
| ------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/login`    | Authenticates a user with `email_id` and `password`. Returns a JWT token upon success.                                        |
| `POST` | `/register` | Registers a new user with required fields (`first_name`, `last_name`, `email_id`, `password`). Assigns incremental `user_id`. |

### 📘 Account Dashboard API Routes
The following API routes are protected by JWT authentication and allow both Strategic Advisors and Individual Traders to interact with account and association data.

| Method | Endpoint                      | Description                                                                                           |
| ------ | ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| `GET`  | `/account_dashboard/:user_id` | Retrieves all user accounts associated with a Strategic Advisor by `user_id`.                         |
| `POST` | `/mark_account_checked`       | Marks a single user account (provided by `account_id`) as checked by the logged-in individual trader. |
| `POST` | `/mark_all_accounts_checked`  | Marks all accounts associated with the logged-in individual trader as checked.                        |
| `GET`  | `/checked_accounts`           | Retrieves all accounts marked as checked by the currently logged-in individual trader.                |

### 👤 User Management API Routes
These routes manage user records such as creating, searching, and deleting users. All endpoints are protected by JWT authentication via JwtUtils.verifyToken.

| Method   | Endpoint          | Description                                                                                                                                                         |
| -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST`   | `/users`          | Creates a new user. Requires `user_id`, `first_name`, `last_name`, `email_id`. Optional: `joining_date`.                                                            |
| `GET`    | `/users/search`   | Searches users by `search_string` in `first_name`, `last_name`, or `email_id`. Supports optional pagination using `is_paginated=true`, `page`, and `rows_per_page`. |
| `DELETE` | `/users/:user_id` | Deletes a user by `user_id`.                                                                                                                                        |

### 📈 Ticker Symbol API Routes
These routes manage ticker symbol details such as searching, updating, and deleting ticker information. All endpoints are protected by JWT authentication via JwtUtils.verifyToken.

| Method | Endpoint          | Description                                                                                                                                                     |
| ------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/tickers/search` | Searches for ticker details (e.g., `isin`, `cusip`, `ticker_symbol`, `company_name`) with optional pagination (`is_paginated=true`, `page`, `rows_per_page`).   |
| `PUT`  | `/tickers/update` | Updates ticker details based on provided identifiers (`cusip`, `isin`, or `ticker_symbol`). Updates `current_price`, `company_name`, and `company_description`. |
| `PUT`  | `/tickers/delete` | Soft deletes a ticker by marking it as deleted using `cusip`, `isin`, or `ticker_symbol`.                                                                       |

### 📊 Proposed Order API Routes
These routes allow for the application of trading algorithms and the conversion of proposed orders into open orders. All endpoints are protected by JWT authentication via JwtUtils.verifyToken.

| Method | Endpoint              | Description                                                                                                                                        |
| ------ | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/apply_algorithm`    | Runs an algorithm to propose orders based on `ticker_symbol` and `order_quantity`, creating sessions and updating proposed order session accounts. |
| `POST` | `/send_to_open_order` | Converts proposed orders with non-zero quantity from a proposed order session into actual open orders.                                             |

### 📊 Open Order API Routes
These routes provide functionality for managing open orders, including creating, reading, updating, and deleting orders. All endpoints are protected by JWT authentication via JwtUtils.verifyToken.

| Method   | Endpoint | Description                                                                   |
| -------- | -------- | ----------------------------------------------------------------------------- |
| `POST`   | `/`      | Creates a new open order for a specific account with a holding.               |
| `GET`    | `/`      | Fetches all open orders associated with the authenticated user.               |
| `PUT`    | `/:id`   | Updates an existing open order identified by `id` for the authenticated user. |
| `DELETE` | `/:id`   | Deletes an existing open order identified by `id` for the authenticated user. |

---

## 📝 One-Time Scripts
> These scripts are designed to be executed once to perform specific tasks, such as populating random data in the database.

| File Name                     | Description                                                                                                                                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `populateUserType.js`         | Connects to the database, fetches all users, and assigns a user type ('Strategic Advisor' or 'Individual Trader') to each user based on a random shuffle, with 5% of users assigned as 'Strategic Advisor'.       |
| `populateTickerPrices.js`     | Fetches all ticker symbols and updates each one with a random price between 10 and 1000, rounded to six decimal places.                                                                                           |
| `populateUserAccounts.js`     | Fetches all Individual Traders, generates random values for projected market value, unrealized gain/loss, and liquid cash for each user, and creates corresponding user accounts with unique account IDs.         |
| `populateUserAssociations.js` | Fetches all Strategic Advisors and Individual Traders, randomly associates each trader with an advisor (round-robin style), and creates user associations in the database.                                        |
| `updateCheckbox.js`           | Updates the `check_box` field to 'checked' for all `UserAssociation` documents associated with a specific `Strategic Advisor`.                                                                                    |
| `populateAccountHoldings.js`  | Fetches all UserAccounts, generates random holdings for each account, and associates them with random ticker symbols, creating `AccountHoldings` records with current and projected quantities and market values. |
