const express = require("express");
const cookieParser = require('cookie-parser')
require("dotenv").config();

const cors = require("cors");
const routes = require("./routes/routes.js");
const { connectDB } = require("./config/database");

const app = express();

/**
 * Middleware configuration
 * - Parse JSON request bodies
 * - Parse URL-encoded request bodies
 * - Enable Cross-Origin Resource Sharing (CORS)
 */
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://taskify-client-tan.vercel.app',  // Your frontend URL
        'http://localhost:5173',  // Vite default port
        'http://localhost:8080'   // If you're using this port
    ],
    credentials: true,  // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Initialize database connection.
 * Exits the process if the connection fails.
 */
connectDB();

/**
 * Mount the API routes.
 * All feature routes are grouped under `/api/v1`.
 */
app.use("/api", routes);

/**
 * Health check endpoint.
 * Useful to verify that the server is up and running.
 */
app.get("/", (req, res) => res.send("Server is running"));

/**
 * Start the server only if this file is run directly
 * (prevents multiple servers when testing with imports).
 */
if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}


