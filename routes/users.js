const express = require('express')
const router = express.Router()
const employeeController = require('../controller/user.controller');

// Route starts with http://localhost:3000/users

// Blocks users by ids

router.get('/all', employeeController.findAll);

module.exports = router