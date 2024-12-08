const express = require("express");
const authController = require('../controllers/auth.controller');
const router = express.Router()

router.post('/login', authController.loginWithEmail);

module.exports = router;

//get과 post의 차이 get은 body를 따로 안보냄, post는 바디를 보냄, get은 가져오는 느낌?