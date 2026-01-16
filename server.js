const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const port = 4000;
require("dotenv").config();

// Authentication Middleware
const auth = require("./middleware/auth");

// app settings
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Router Imports
const defaultRouter = require("./router/defaultRouter")
const quoteRouter = require("./router/quoteRouter")
const userRouter = require("./router/userRouter")

// Default Route
app.use(defaultRouter);

// Quotes
app.use(quoteRouter);

// User Route
app.use(userRouter);
 
// Start server
app.listen(port, () => {
  console.log(`Frontend running at http://localhost:${port}`);
});
