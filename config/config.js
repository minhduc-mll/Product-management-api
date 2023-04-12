const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

// Configuration Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

// Configuration Mongoose
const connectDb = async () => {
    try {
        await mongoose
            .connect(process.env.DATABASE_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => {
                console.log("database connection successful");
            });
    } catch (err) {
        console.error(err);
    }
};

module.exports = connectDb;
