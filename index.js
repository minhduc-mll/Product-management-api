const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/config");
const router = require("./routes");

// App Engine
const app = express();

// Port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    })
);

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//view engine
app.disable("view cache");

app.use("/api", router);

// Development Server
app.listen(PORT, () => {
    // Database Connection
    connectDb();
    console.log(`Application started on port: ${PORT}`);
});
