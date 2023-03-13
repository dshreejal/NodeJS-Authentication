const mongoose = require('mongoose');
require('dotenv').config();
const mongoURL = process.env.Mongo_URL;

const connectToMongo = () => {
    mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => { console.log("Connected to database successfully"); })
        .catch((err) => console.log("Error occured", err.message))
}

module.exports = connectToMongo;