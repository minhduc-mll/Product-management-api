const express = require("express");
const router = require("./routes");
require("dotenv").config();
const cookieParser = require("cookie-parser");

// Database Connection
const connectDb = require("./config/config");
connectDb();

// App Engine
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/public", express.static("./"));
app.use("/", router);

// Development Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Application started on port: http://localhost:${PORT}`);
});
