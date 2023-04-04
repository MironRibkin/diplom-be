'use strict';

const accessTokenSecret = 'secret-key';
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

exports.findAll = function (req, res) {
    User.findAll(function (err, user) {
        if (err)
            res.send(err);
        res.json({items: user});
    });
};
exports.create = function (req, res) {
    const new_user = new User(req.body);
//handles null error
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({error: true, message: 'Please provide all required field'});
    } else {
        User.create(new_user, function (err, user) {
            if (err)
                res.status(403).send(err);
            res.json({error: false, message: "Employee added successfully!", data: user});
        });
    }
};

exports.getAuth = function (req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    jwt.verify(token, accessTokenSecret, (err, {id}) => {
        User.findById(id, function (err, user) {
            if (err)
                res.send(err);
            res.json(user);
        })
    })
};

exports.findById = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
};
exports.update = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({error: true, message: 'Please provide all required field'});
    } else {
        User.update(req.params.id, new User(req.body), function (err, user) {
            if (err)
                res.status(403).send(err);
            res.json({error: false, message: user});
        });
    }
};
exports.delete = function (req, res) {
    User.delete(req.body.ids, function (err, user) {
        if (err)
            res.send(err);
        res.json({error: false, message: 'User successfully deleted'});
    });
};
exports.block = function (req, res) {
    User.block(req.body.ids, function (err, user) {
        if (err)
            res.send(err);
        res.json({error: false, message: 'User successfully blocked'});
    });
};
exports.unblock = function (req, res) {
    User.unblock(req.body.ids, function (err, user) {
        if (err)
            res.send(err);
        res.json({error: false, message: 'User successfully unblocked'});
    });
};
exports.findPaginated = function (req, res) {
    User.findPaginated(parseInt(req.query.offset), parseInt(req.query.pageSize), function (err, user) {
        if (err)
            res.send(err);
        res.send(user);
    });
};
exports.login = function (req, res) {
    // Read username and password from request body
    const {email, password} = req.body;
    console.log(req.body);
    // Filter user from the users array by username and password
    User.findByEmailAndPassword(email, password, function (err, user) {
        if (err || user[0] === undefined) {
            res.send('Username or password incorrect');
        } else {
            // Generate an access token
            const accessToken = jwt.sign({email: user[0].email, status: user[0].status, id: user[0].id}, accessTokenSecret);
            res.json({
                token: accessToken
            });
        }
    });

};