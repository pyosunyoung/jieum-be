const express = require("express");
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router()

//회원가입 //post 보내는거, get 받는 느낌?
router.post("/",userController.createUser) // 이 url로 들어왔을때 무슨 행동을 할지 데이터 생성
router.get("/me",authController.authenticate, userController.getUser) // 토큰이 valid한 토큰인지, 이 token 값을 가지고 유저를 찾아서 리턴
// get은 토큰값을 body가 아닌 헤더가 줄 것 그래서 get사용 이유 토큰 값으로 유저를 찾았으면 그것을 유저에게 그값을 줘야하니까 get씀
// authController실행 후 userController실행 이게 미들웨어 느낌, getUser는 uer값을 가져온것
// 함수는 딱 하나의 역할만 해야함 즉 토큰이 valid한 토큰인지 authController.authenticate 이 함수의 역할, 이 token 값을 가지고 유저를 찾아서 리턴 userController.getUser 이건 이함수의 역할임
// authenticate는 여러개 코드에서 사용될 수 있기 떄문에 따로 쓰이게 한 것
router.post("/like", authController.authenticate,userController.toggleLike);

// 좋아요한 게시물 목록 가져오기
router.get("/liked-products", authController.authenticate,userController.getLikedProducts);
router.post("/user/increase-temperature", authController.authenticate,userController.increaseTemperature);
router.get("/user/me",authController.authenticate, userController.updateTemperature)
module.exports=router;