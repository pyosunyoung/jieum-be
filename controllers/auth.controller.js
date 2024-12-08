const jwt = require('jsonwebtoken')
const User = require('../models/User')
const bcrypt = require("bcryptjs");
require("dotenv").config()
const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY
const authController = {}

authController.loginWithEmail = async(req, res) => {
  try{
    const {email,password} = req.body
    let user = await User.findOne({email});
    if(user){
      const isMatch = await bcrypt.compare(password, user.password); // 암호화 비교 작업
      if(isMatch){
        // token 다음에 로그인 안해도 되게 설정
        const token = await user.generateToken()
        return res.status(200).json({status:"success", user, token});
      }
    
    }
    throw new Error("invalid email or password");
  }catch(error){
    res.status(400).json({status:"fail", error: error.message});
  }
};
authController.authenticate = async(req,res,next) => { // next는 미들웨어임 
  try{
    const tokenString = req.headers.authorization // fe api.js파트에 있음 이것을 넘겨주는 것
    if(!tokenString) throw new Error("Token not found"); 
    const token = tokenString.replace("Bearer ",""); //Bearer를 => ""빈문자열로 변경, 순수 토큰값만 생성됨, fe api.js참고
    jwt.verify(token, JWT_SECRET_KEY, (error,payload)=>{
      if(error) throw new Error("invalid token");
      req.userId = payload._id; 
      // 에러가 아니라면 해당 id값을 req에 userId를 지금 생성해서넘겨줌,
      //user.js에 토큰 만든거 코드 sign 확인 
    }) // 토큰 검증 코드
    next() // checkAdminPermission 여기로 넘어감
  }catch(error){
    res.status(400).json({status:"fail", error: error.message})
  }
};

authController.checkAdminPermission = async(req,res,next) => {
  try{
    // token 값을 통해 admin인지 아닌지 알 수 있음, 이 작업은 위에서 userId로 넘겨줬기 떄문에 한번 더 할 필욧 없고  authenticate함수만 불러오면 됨
    const {userId} = req
    const user = await User.findById(userId)
    if(user.level !== "admin") throw new Error("no permission")
    next()

  }catch(error){
    res.status(400).json({status:"fail", error:error.message});
  }
}


module.exports = authController