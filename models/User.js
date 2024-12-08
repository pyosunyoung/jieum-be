const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken')
require("dotenv").config() // .env가져오는 로직
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const userSchema = Schema({
  email:{type:String, required:true, unique:true},
  password:{type:String, required:true},
  name:{type:String, required:true},
  PhoneNumber:{type:String,required:true, default: ""},
  DeterminationWord:{type:String,required:true, default: ""},
  studentNumber:{type:String, required:true, default: ""},
  department:{type:String, required:true, default: ""},
  InterestTag:{type:Array, required:true, },
  level:{type:String, default:"admin"}, // 2types: customer, admin type, 일반 사용자는 customer 하나는 admin type, default는 기본값이 customer 아무것도 안넣어주면
  likedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  temperature:{type:Number, default: 26},
},{timestamps:true})
userSchema.methods.toJSON = function(){ // 불필요한 정보를 빼고 유저한테 공개하는 작업
  const obj = this._doc // 모든 값을 가져오고
  delete obj.password
  delete obj.__v
  delete obj.updateAt
  delete obj.createAt
  return obj // 위 delete된 값을 제외하고 다른 값들을 가져오겠다
}

userSchema.methods.generateToken = async function() {
  const token = await jwt.sign({_id:this.id},JWT_SECRET_KEY, {expiresIn:"1d"}) // sign은 유저의 특정 값이랑 나만의 시크릿 값을 섞어너 값을 생성하는 작업인듯?, exprieIn은 하루? 하루동안 유지? 인듯
  return token;
}

const User = mongoose.model("User", userSchema);
module.exports = User;