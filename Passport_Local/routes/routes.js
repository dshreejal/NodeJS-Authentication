const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const Article = require('../models/Article')
const { genPassword } = require('../utils/passwordUtils');
const { checkAuthenticated } = require('../middleware/checkAuthenticated')

router.post('/register', async (req, res) => {
    const saltHash = genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const user = await User.findOne({ email: req.body.email });
    if (user) {
        res.status(400).send("User already exists")
    }

    const newUser = await User.create({
        email: req.body.email,
        hash: hash,
        salt: salt,
    });

    res.status(201).send({ user: newUser, message: "User created successfully" })
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failed' }), async (req, res) => {
    const user = req.user;
    res.status(200).send({ user: user, message: "Logged in successfully" });
})

router.post('/login-failed', (req, res) => {
    res.status(401).send({ message: "Incorrect username or password" });
});

router.get('/logout', function (req, res) {
    req.logout((err) => {
        if (err) {
            res.status(500).send({ message: "Error logging out" });
        } else {
            req.session.destroy(function (err) {
                if (err) {
                    res.status(500).send({ message: "Error logging out" });
                } else {
                    res.status(200).send({ message: 'Logged out successfully' });
                }
            });
        }
    });
});

router.post('/article', checkAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const article = new Article({ title, description, user: req.user.id });
    const savedArticle = await article.save();
    res.status(201).send({ article: savedArticle, message: "Article added successfully" });
})

module.exports = router