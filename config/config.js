const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

// Configuration Dotenv
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

// Configuration Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const uri = process.env.MONGODB_URL;

// Configuration Mongoose
const connectMongoose = async () => {
    try {
        await mongoose
            .connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => {
                console.log("mongodb connection successful");
            });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = {
    connectMongoose,
};
