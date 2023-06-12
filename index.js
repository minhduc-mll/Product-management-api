const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectMongoClient, connectMongoose } = require("./config/config");
const router = require("./routes");
const dashboardRouter = require("./routes/dashboard");

// App Engine
const app = express();

// Port
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
    origin: [
        "*",
        "https://hgtp-management.netlify.app/",
        "http://localhost:3000",
    ],
    credentials: true, //access-control-allow-credentials:true
};
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//view engine
app.disable("view cache");

app.use("/api", router);
app.use("/", dashboardRouter);

// Development Server
app.listen(PORT, () => {
    // Database Connection
    connectMongoose();
    // connectMongoClient().catch(console.dir);
    console.log(`Application started on port: ${PORT}`);
});
