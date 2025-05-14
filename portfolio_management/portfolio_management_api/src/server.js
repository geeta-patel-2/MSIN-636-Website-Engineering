// index.js
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoutes.js";
import tickerSymbolRoutes from "./routes/tickerSymbolRoutes.js";
import loginRouter from "./routes/loginRoutes.js";
import connectDB from "./config/db.js";
import accountDashboardRoutes from "./routes/AccountDashboard.js";
import proposedOrderRoutes from "./routes/ProposedOrderRoutes.js";
import openOrderRoutes from "./routes/OpenOrderRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
await connectDB();

// Routes

app.use('/api', loginRouter);
app.use('/api', userRoutes); // Prefix user routes with /api
app.use('/api', tickerSymbolRoutes); // Prefix ticker routes with /api
app.use('/api', accountDashboardRoutes);
app.use('/api', proposedOrderRoutes);
app.use('/api/open-orders', openOrderRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


// Main handler for serverless
export default async function handler(req, res) {
    const parsedUrl = parse(req.url, true);
    req.query = parsedUrl.query;
    req.path = parsedUrl.pathname;

    return app(req, res);
}