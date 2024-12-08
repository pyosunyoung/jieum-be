const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const  PostSchema = Schema({
  sku:{type:String, required:true, unique:true}, // uniquer한 값은 중복으로 데이터베이스에 넣을 수 없음
  name:{type:String, required:true},
  image:{type:String}, // required제거함
  category:{type:Array, required:true},
  description:{type:String, required:true},
  price:{type:Number, required:true},
  stock:{type:Object, required:true},
  status:{type:String, default:"active"},
  isDeleted:{type:Boolean, default:false},
  likes: { type: Number, default: 0 }, // 좋아요 수
  
  
  // 2types: customer, admin type, 일반 사용자는 customer 하나는 admin type
  
},{timestamps:true})
PostSchema.methods.toJSON = function(){ // 불필요한 정보를 빼고 유저한테 공개하는 작업
  const obj = this._doc // 모든 값을 가져오고
  delete obj.__v
  delete obj.updateAt
  delete obj.createAt
  return obj // 위 delete된 값을 제외하고 다른 값들을 가져오겠다
}

const Post = mongoose.model("Product", PostSchema);
module.exports = Post;