const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const eventRouter = require("./Routing/eventRouting");
const userRouter = require("./Routing/userRouting");
const orderRouter = require("./Routing/orderRouting");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controller/errorController");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

// 1) GLOBAL MIDDLEWARES

// Secure HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["category"],
  })
);

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin (frontend URL)
    credentials: true, // Allow cookies and credentials to be sent and received
  })
);

// Serve static files
app.use(express.static(`${__dirname}/public`));

app.use(express.json());
// Parse incoming JSON requests
app.use(express.json());

// 3) ROUTES
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
