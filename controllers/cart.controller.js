const { populate } = require('dotenv');
const Cart = require('../models/Cart');

const cartController = {};
cartController.addItemToCart = async (req, res) => {
  try {
    // 값들 가져옴
    const { userId } = req; // req는 미들웨어인 authcontroller에서 가져옴
    const { productId, size, qty } = req.body;
    
    // 유저를 가지고 카트 찾기
    let cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      // 유저가 만든 카트가 없다? > 만들어주기
      cart = new Cart({ userId });
      await cart.save();
    }

    // 이미 카트에 들어가있는 아이템이냐? productId, size 둘다 체크 size가 다르면 상품도 다른것이 기 떄문
    const existItem = cart.items.find((item) =>
      item.productId.equals(productId) && item.size === size // ID검사, SIZE검사 같으면 들어가면 안됨(중복)
      //ProductId같은 몽구스 오브젝트 타입은 스트링이 아니라 equals로 비교해야함 그런듯
    );
    if(existItem){
      // 그렇다면 에러 ('이미 아이템이 카트에 있습니다.')
      throw new Error("이미 신청을 완료하였습니다.")
    }
    // 카트에 아이템을 추가
    cart.items = [...cart.items, {productId, size, qty}]
    await cart.save()
    res.status(200).json({status:"success", data:cart, cartItemQty: cart.items.length}); // 추가 눌렀을 때 cartItemQty 카트 몇개가 담겼나 확인
  } catch (error) {
    return res.status(400).json({status:"fail", error:error.message});
  }
};

cartController.getCart = async(req,res) => { // get은 정보 받아오는 것
  try{
    const {userId} = req
    const cart = await Cart.findOne({userId}).populate({
      path:'items',
      populate:{
        path:"productId",
        model:"Product",
      }
    }) // populate를 통해 추가로 정보 들고와야 함 // 이름이랑 가격 정보가 안나옴 여기선
    res.status(200).json({status:"success", data:cart.items})
  }catch(error){
    return res.status(400).json({status:"fail", error:error.message});
  }
}

cartController.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const cart = await Cart.findOne({ userId });
    cart.items = cart.items.filter((item) => !item._id.equals(id));

    await cart.save();
    res.status(200).json({ status: 200, cartItemQty: cart.items.length });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.editCartItem = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    const { qty } = req.body;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
      },
    });
    if (!cart) throw new Error("There is no cart for this user");
    const index = cart.items.findIndex((item) => item._id.equals(id));
    if (index === -1) throw new Error("Can not find item");
    cart.items[index].qty = qty;
    await cart.save();
    res.status(200).json({ status: 200, data: cart.items });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.getCartQty = async (req, res) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) throw new Error("There is no cart!");
    res.status(200).json({ status: 200, qty: cart.items.length });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = cartController;
