const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectMongoose } = require("./config/config");
const router = require("./routes");
const dashboardRouter = require("./routes/dashboard");

// App Engine
const app = express();

// Middleware
const corsOptions = {
    origin: ["https://hgtp-management.netlify.app", "http://localhost:3000"],
    credentials: true, //access-control-allow-credentials:true
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// View engine
app.use("/api", router);
app.use("/", dashboardRouter);

// Port
const PORT = process.env.PORT || 5000;

// Development Server
app.listen(PORT, () => {
    // Database Connection
    connectMongoose();
    console.log(`Application started on port: ${PORT}`);
});
