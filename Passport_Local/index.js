const express = require('express');
const app = express();
const connectToMongo = require('./config/db');
const session = require('express-session')
require('dotenv').config();
const passport = require('passport');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToMongo();


const PORT = process.env.PORT || 5000


/**
 * -------------- SESSION SETUP ----------------
 */

const MongoStore = require('connect-mongo');
const sessionStore = MongoStore.create({ mongoUrl: process.env.MONGO_URL, collectionName: 'sessions' });

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
}));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());



app.use(require('./routes/routes'));


app.listen(PORT, () => {
    console.log(`Backend sever running on http://localhost:${PORT}`);
})