'use strict';
var dbConn = require('../config');
//Employee object create
var User = function (employee) {
    this.firstname = employee.firstname;
    this.lastname = employee.lastname;
    this.email = employee.email;
    this.created_at = new Date();
    this.updated_at = new Date();
    this.password = employee.password ? employee.password : "";
    this.id = employee.id;
    this.status = employee.status ? employee.status : "ACTIVE";
};
User.create = function (newEmp, result) {
    dbConn.query("INSERT INTO user set ?", newEmp, function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res.insertId);
        }
    });
};
User.findById = function (id, result) {
    dbConn.query("Select * from user where id = ? ", id, function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};
User.findAll = function (result) {
    dbConn.query("Select * from user", function (err, res) {
        if (err) {
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
User.findPaginated = function (offset, pageSize, result) {
    dbConn.query("Select * from user LIMIT ?, ?", [offset, pageSize], function (err, res) {
        if (err) {
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
User.update = function (id, user, result) {
    dbConn.query("UPDATE user SET firstname=?,lastname=?,email=?,status=? WHERE id = ?", [user.firstname, user.lastname, user.email, user.status, id], function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};
User.delete = function (ids, result) {
    dbConn.query("DELETE FROM user WHERE id IN (?)", [ids], function (err, res) {
        if (err) {
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
User.block = function (ids, result) {
    dbConn.query("UPDATE user SET status='BLOCKED' WHERE id IN (?)", [ids], function (err, res) {
        if (err) {
            result(null, err);
        } else {
            result(null, res);
        }
    })
};
User.unblock = function (ids, result) {
    dbConn.query("UPDATE user SET status='ACTIVE' WHERE id IN (?)", [ids], function (err, res) {
        if (err) {
            result(null, err);
        } else {
            result(null, res);
        }
    })
};
User.findByEmailAndPassword = function (email, password, result) {
    dbConn.query("Select * from user where email = ? and password = ? ", [email, password], function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};
module.exports = User;