const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose
            .connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => {
                console.log("database connection successful");
            });
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectDb;
