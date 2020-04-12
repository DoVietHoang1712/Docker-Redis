const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const client = require('redis').createClient(6379);

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById({ id }, (err, user) => {
        return done(err, user);
    })
});

passport.use('local.signup', new LocalStrategy({
    passwordField: 'password',
    usernameField: 'email',
    passReqToCallback: true
}, async function (req, email, password, done) {
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid Password').notEmpty().isLength({ min: 6 });
    let errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach((error) => {
            messages.push(error);
        });
        return done(null, false, req.flash('error', messages));
    }
    try {
        let foundUser = await User.findOne({ email: email.trim() });
        if (foundUser) {
            return done(null, false, { message: 'Email is already in use.' });
        }
        let newUser = new User({
            email: email,
            password: password
        });
        await newUser.save();
        await client.set(email, password);
        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
}));

passport.use('local.signin', new LocalStrategy({
    passwordField: 'password',
    usernameField: 'email',
    passReqToCallback: true
}, async function (req, res, email, password, done) {
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid Password').notEmpty().isLength({ min: 6 });
    let errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach((error) => {
            messages.push(error);
        });
        return done(null, false, req.flash('error', messages));
    }
    try {
        if (client.get(email, (err, data) => {
            if (data !== null) {
                User.findOne({email}, (err, user) => {
                    if(user) return done(null, user);
                });
                res.cookie(email, password);
            }
        }));
        else {
            let foundUser = await User.findOne({ email: email.trim() });
            if (!foundUser) {
                return done(null, false, { message: 'Email is not sign up.' });
            }
            if (foundUser.password == password) {
                await client.set(email, password);
                res.cookie(email, password);
                return done(null, foundUser);
            }
            else {
                return done(null, false, { message: 'Password Incorrect' });
            }
        }
    } catch (error) {
        return done(error);
    }
}));