const mongoose = require("mongoose");
const User = require("./User");
const Product = require("./Post");
const Cart = require('./Cart');
const Schema = mongoose.Schema;
const orderSchema = Schema(
  {
    userId: { type: mongoose.ObjectId, ref: User,required: true },
    status: { type: String, default: "진행중" },
    totalPrice: { type: Number, required: true, default: 0 }, // 프론트에서 받아옴
    shipTo: { type: Object, default:"천안"}, // 배송주소 require제거
    contact: { type: Object, default:"01087532616"}, // 연락처 require제거
    orderNum: { type: String }, // 오더넘버 환불 이럴 떄 필요
    items: [ // 주문 항목들 정보 보여주는
      {
        productId: { type: mongoose.ObjectId, ref: Product,required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true, default: 1 },
        size: { type: String, default:"" }, // require 삭제함
      },
    ],
  },
  { timestamps: true }
);
orderSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};
orderSchema.post("save", async function () {
  //카트를 비워주자
  const cart = await Cart.findOne({userId:this.userId})
  cart.items = []
  await cart.save();
})

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;