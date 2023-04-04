var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const User = require('./model/user.model');


const jwt = require('jsonwebtoken');
const accessTokenSecret = 'secret-key';
var app = express();

var cors = require('cors')

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('test');
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log(token);
        jwt.verify(token, accessTokenSecret, (err, user1) => {
            console.log(user1);
            User.findById(user1.id, function (err, user) {
                if (err) {
                    return res.sendStatus(403);
                }
                console.log('test2', user);
                if (user[0].status === 'BLOCKED') {
                    console.log(user);
                    return  next(createError(401));
                }
                req.user = user[0];
                next();
            });
        });
    } else {
        res.sendStatus(401);
    }
};

app.use('/', indexRouter);
app.use('/users', authenticateJWT, usersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
