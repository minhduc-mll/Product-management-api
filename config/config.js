const mongoose = require("mongoose");

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
