require('dotenv').config();
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const Article = require('../models/Article')
// const { checkAuthenticated } = require('../middleware/checkAuthenticated')

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (user) {
        res.status(400).send("User already exists");
    }

    const newUser = await User.create({
        email,
        password: bcrypt.hashSync(password, 10),
    });

    res.status(201).send({
        user: {
            id: newUser._id,
            email: newUser.email
        }, message: "User created successfully"
    })
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(401).send({
            success: false,
            message: "Could not find the user."
        })
    }

    if (user && (await user.isValidPassword(req.body.password))) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).send({
            user: {
                _id: user._id,
                email: user.email,
            }, authToken: token, message: "Logged in successfully"
        });
    }
    else {
        res.status(401).send({ success: false, message: "Invalid credentials" });
    }
});

router.post('/article', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        req.user = user;
        next();
    })(req, res, next);
}, async (req, res) => {
    const { title, description } = req.body;
    const article = new Article({ title, description, user: req.user.id });
    const savedArticle = await article.save();
    res.status(201).send({ article: savedArticle, message: "Article added successfully" });
});

router.get('/article', async (req, res) => {
    const data = await Article.find({});
    res.json(data);
})

module.exports = router




