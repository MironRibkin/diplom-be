var express = require('express');
var router = express.Router();
const employeeController = require('../controller/user.controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// Route starts with http://localhost:3000/users

router.post('/login', employeeController.login)
// Create a new employee
router.post('/register', employeeController.create);
module.exports = router;
