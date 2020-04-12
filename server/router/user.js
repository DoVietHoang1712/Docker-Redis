const router = require('express').Router();
const User = require('../model/user');
const passport = require('passport');

router.get('/signup', (req, res) => {
    let messages = req.flash('error');
    console.log(messages);
    res.render('signup.ejs', {messages: messages, hasError: messages.length});
});

router.get('/signin', (req, res) => {
    let messages = req.flash('error');
    console.log(messages);
    res.render('signin.ejs', {messages: messages, hasError: messages.length});
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/',
    failureFlash: true,
    failureRedirect: '/users/signup'
}));

router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/',
    failureFlash: true,
    failureRedirect: '/users/signin'
}));

module.exports = router;