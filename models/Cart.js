const mongoose=require("mongoose");
const User = require('./User'); // import해줘야 함
const Product = require('./Post');
const Schema = mongoose.Schema;
const  cartSchema = Schema({
  userId:{type:mongoose.ObjectId, ref:User}, // 외래키
  items:[{ // 이런건 프론트엔드에서 받아오는 것
    productId:{type:mongoose.ObjectId, ref:Product},
    size:{type:String, default:""}, // require true 제거함
    qty:{type:Number, default:1, required:true},
  }]
},{timestamps:true})
cartSchema.methods.toJSON = function(){ // 불필요한 정보를 빼고 유저한테 공개하는 작업
  const obj = this._doc // 모든 값을 가져오고
  delete obj.__v
  delete obj.updateAt
  delete obj.createAt
  return obj // 위 delete된 값을 제외하고 다른 값들을 가져오겠다
}

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;