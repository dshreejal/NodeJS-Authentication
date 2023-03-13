const express = require('express');
const app = express();
const connectToMongo = require('./config/db');
require('dotenv').config();
const passport = require('passport');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToMongo();


const PORT = process.env.PORT || 5000




/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

require('./config/passport');

app.use(passport.initialize());




app.use(require('./routes/routes'));


app.listen(PORT, () => {
    console.log(`Backend sever running on http://localhost:${PORT}`);
})