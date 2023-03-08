const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const connectDb = require("./config/config");
const router = require("./routes");
const cookieParser = require("cookie-parser");

// App Engine
const app = express();

// Port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/", router);

// Database Connection
connectDb();

// Development Server
app.listen(PORT, () => {
    console.log(`Application started on port: http://localhost:${PORT}`);
});
