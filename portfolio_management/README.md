# Portfolio Management API

This project is a RESTful API built using **Node.js**, **Express.js**, and **MongoDB** with **Mongoose**. The API facilitates user and ticker management, allowing CRUD operations for users and tickers, as well as search and soft delete functionalities.

## Project Purpose and Overview

### **Purpose:**
The purpose of this project is to create a **Portfolio Management System** that caters to both **strategic advisors** and **individual users**. This system enables strategic advisors to manage the portfolios of multiple users, while also providing an option for individual users to independently manage their own portfolios. The system aims to provide a seamless and efficient platform for managing investment portfolios, ensuring that both strategic advisors and users have the necessary tools to track and manage assets, make informed decisions, and optimize their financial strategies.

### **Overview:**
This **Portfolio Management Platform** will have two main user roles:

1. **Strategic Advisors**:
    - These users have the ability to manage and oversee multiple client portfolios.
    - They can make portfolio adjustments, monitor investments, provide insights, and offer advice based on market conditions.
    - Advisors will be able to view the portfolios of their clients, make necessary changes, and track performance in real-time.

2. **Individual Users**:
    - These users have the option to independently manage their portfolios without the assistance of an advisor.
    - Users will be able to track their investments, view portfolio performance, and make changes as they see fit.
    - If the user opts to be managed by a strategic advisor, they can grant access for their portfolio to be handled by the advisor.

Key features of the system include:

- **User Registration and Authentication**:  
  Both strategic advisors and individual users will be able to sign up, log in, and manage their profiles securely.

- **Portfolio Management**:  
  Users (and advisors) can create, update, and track investment portfolios. Portfolios can include various assets like stocks, bonds, mutual funds, and ETFs.

- **Advisor-User Relationship**:  
  Strategic advisors can request access to manage individual users' portfolios. Users can opt to allow or deny this access.

- **Portfolio Tracking and Analytics**:  
  Real-time tracking of portfolio performance, including investment value, gains/losses, and historical trends.

- **Advisory Features**:  
  Strategic advisors can provide recommendations to their clients, and clients can communicate with advisors about investment strategies.

This project aims to give both strategic advisors and users a flexible and comprehensive system to manage their financial portfolios, whether the user chooses to manage their investments on their own or opt for professional advice and management.



## Current Progress

### 1. **User Management Routes**

- **GET `/api/users/search`**  
  Searches string provided in `search_with` in user in `first_name`, `last_name`, `email_id` fields and returns paginated users if requested else all users.

- **POST `/api/users`**  
  Creates a new user with fields `first_name`, `last_name`, `email_id`.

- **DELETE `/api/users/:user_id`**  
  Deletes a user by marking `isDeleted` as `true` instead of deleting the record permanently.

### 2. **Ticker Management Routes**

- **GET `/api/tickers/search?search=<search_string>`**  
  Searches for a given string in the fields `isin`, `cusip`, `ticker_symbol`, and `company_name`, excluding records where `isDeleted` is `true`.

- **PUT `/api/tickers/update`**  
  Updates a ticker's details (fields `current_price`, `company_name`, and `company_description`) based on a provided identifier (`cusip`, `isin`, or `ticker_symbol`).

- **PUT `/api/tickers/delete`**  
  Soft deletes a ticker by setting `isDeleted` to `true` for a given identifier (`cusip`, `isin`, or `ticker_symbol`).

### 3. **MongoDB Integration**

- **MongoDB Connection**: The application is connected to a MongoDB database using **Mongoose**. All user and ticker data is stored in the database, and operations are handled through Mongoose models and queries.
- **Ticker and User Mongoose Models**: Defined schemas for `users` and `ticker_details` tables with appropriate validation and field types.

### 4. **Project Structure**

The project has the following directory structure:

```
project/
│
├── models/                  # Contains Mongoose models
│   ├── User.js              # Schema for users
│   └── TickerDetail.js      # Schema for ticker details
│
├── routes/                  # Contains route definitions
│   ├── userRoutes.js        # Routes related to user management
│   └── tickerRoutes.js      # Routes related to ticker management
│
├── server.js                # Main entry point for the application
├── .env                     # Environment variables (MongoDB URI, PORT, etc.)
├── package.json             # Project dependencies and scripts
└── node_modules/            # Installed Node modules
```

### 5. **Environment Variables**

The project uses environment variables to configure sensitive information such as database connection strings and server ports. Ensure you have a `.env` file in the root of the project with the following content:

```
MONGO_URI=mongodb://localhost:27017/portfolio_management
PORT=5000
```


### 6. **How to Run the Project**

To run the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd portfolio-management-api
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up MongoDB**:
    - Make sure you have MongoDB running locally or use a cloud database like MongoDB Atlas.
    - Update the `.env` file with the correct MongoDB connection string.

4. **Run the server**:

   ```bash
   npm start
   ```

5. **Access the API**:
    - The API will run at `http://localhost:5000`.
    - You can test the routes using Postman or cURL.

### 7. **API Endpoints Overview**

#### **User Management Endpoints**

- **POST `/api/users`** - Create a new user.
- **GET `/api/users/:user_id`** - Get a user by ID.
- **PUT `/api/users/:user_id`** - Update user by ID.
- **DELETE `/api/users/:user_id`** - Soft delete user by ID.

#### **Ticker Management Endpoints**

- **GET `/api/tickers/search`** - Search tickers by string (in `isin`, `cusip`, `ticker_symbol`, `company_name`).
- **PUT `/api/tickers/update`** - Update ticker details by `cusip`, `isin`, or `ticker_symbol`.
- **PUT `/api/tickers/delete`** - Soft delete ticker by `cusip`, `isin`, or `ticker_symbol`.

### 8. **Future Enhancements**

- **Authentication and Authorization**: Add JWT-based authentication to secure the API.
- **Pagination and Filtering**: Implement pagination and more advanced filtering for searching users and tickers.
- **Validation and Error Handling**: Improve validation of input data (e.g., ensuring valid email format for users).
- **Unit Testing**: Write unit tests to ensure the correctness of routes and models.

### 9. **Technologies Used**

- **Node.js**: Backend runtime for JavaScript.
- **Express.js**: Web framework for building the API.
- **MongoDB**: NoSQL database for storing user and ticker data.
- **Mongoose**: ODM (Object Document Mapper) for MongoDB.
- **dotenv**: To manage environment variables securely.

### 10. **Contributing**

Feel free to open issues or submit pull requests if you'd like to contribute to this project.


# Next Steps for Project Completion

### 1. **Add Account Dashboard APIs**
- The next step is to create the **Account Dashboard APIs** for both strategic advisors and individual users. These APIs will serve as the central hub where users can view their portfolio performance, recent transactions, and other key financial data.
- The Account Dashboard will include the following functionalities:
    - **View Portfolio Summary**: Retrieve an overview of all assets within a portfolio, including performance, value, gains, and losses.
- This will require creating new endpoints in the API that aggregate data from various sources, including user portfolios, transaction records, and external market data.

### 2. **Create Order Generation APIs**
- The **Order Generation APIs** will allow users (or advisors) to place orders to buy or sell financial assets within the system. This is essential for managing an investment portfolio. The order generation logic will handle different order types such as market orders, limit orders, and stop-loss orders.
- Key features of the order generation API:
    - **Create New Order**: Allows users or advisors to place an order for a specific asset with certain parameters (quantity, price, type of order, etc.).
    - **Cancel Order**: If an order has not been executed, it should be cancellable.
- This will involve creating endpoints for placing, viewing, and managing orders. It may also involve integrating with trading platforms or market APIs to execute these orders in real-time.

### 3. **Write Logic to Get Ticker Price from Market**
- Another important next step is to implement logic to **retrieve real-time ticker prices** from the market. This will allow users and advisors to see up-to-date information about the value of assets within their portfolio, which is crucial for making informed investment decisions.
- The process will include:
    - **Fetching Ticker Data**: Use an external API to fetch the latest ticker data for a specific symbol.
    - **Price Updates**: Implement a mechanism to periodically update the ticker prices and store them in the database or cache for quick access.
    - **Handling Errors & Latency**: Implement error handling and retry mechanisms for fetching market data, as financial APIs may occasionally be unavailable or slow.
- Once implemented, this logic can be integrated into portfolio management features to display live prices for each asset, which will help users and advisors track the market's performance in real time.

---

These three steps are essential for completing the current phase of the project. By adding the **Account Dashboard APIs**, **Order Generation APIs**, and the logic to **fetch real-time ticker prices**, the platform will have the necessary functionality for managing portfolios, placing trades, and staying up-to-date with market movements.
