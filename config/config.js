const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");
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

const uri = process.env.DATABASE_URL;

// Configuration Mongoose
const connectMongoose = async () => {
    try {
        await mongoose
            .connect(uri, {
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

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function connectMongoClient() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

module.exports = {
    connectMongoose,
    connectMongoClient,
};
