const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectMongoose } = require("./config/config");
const router = require("./routes");
const dashboardRouter = require("./routes/dashboard");

// App Engine
const app = express();

// Middleware
var allowlist = [
    "https://hgtp-management.vercel.app/",
    "https://hgtp-management.netlify.app",
    "http://localhost:3000",
];
var corsOptionsDelegate = function (req, callback) {
    var corsOptions = {
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, //access-control-allow-credentials:true
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    };
    if (allowlist.indexOf(req.header("Origin")) !== -1) {
        corsOptions = { origin: true, ...corsOptions }; // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));
app.options("*", cors(corsOptionsDelegate)); // include before other routes

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// View engine
app.use("/api", router);
app.use("/", dashboardRouter);

// Port
const PORT = process.env.PORT || 8080;

// Development Server
app.listen(PORT, () => {
    // Database Connection
    connectMongoose();
    console.log(`Application started on port: ${PORT}`);
});
