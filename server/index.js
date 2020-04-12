const express = require('express');
const bodyParser = require('body-parser');
const expressLayput = require('express-ejs-layouts');
const path = require('path');
const PORT = process.env.PORT || 3000;
const PORT_REDIS = process.env.PORT_REDIS || 6379;
const ExpressValid = require('express-validator');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const app = express();
require('./config/passport');

//View engines
app.set('layout', 'layouts/layout');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//Use Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressLayput);
app.use(ExpressValid());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    //store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 180*60*1000}
}));
//Router
app.use('/', require('./router/index'));
app.use('/users/', require('./router/user'));
app.listen(PORT, () => {
    console.log('Running');
});