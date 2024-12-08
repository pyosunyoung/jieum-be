const Order = require('../models/Order');
const { randomStringGenerator } = require('../utils/reandomStringGenerator');
const postController = require('./post.controller');
const orderController = {};
const PAGE_SIZE = 15;
orderController.createOrder = async (req, res,next) => {
  try {
    //프론트엔드에서 데이터 보낸거 받아와 userId, totalPrcie, shipTO, contact, orderList
    const { userId } = req; // 헤더인가 여긴?
    const { shipTo, contact, totalPrice, orderList } = req.body; // 프론트에서 받아옴
    //주문하려 했지만 재고가 없는경우 어케 할까? product stock 확인
    
    // 재고  확인 & 재고 업데이트 => product와 관련있을듯, 업데이트라 await사용
    // const insufficientStockItems = await postController.checkItemListStock(
    //   orderList
    // ); // 아이템들이 재고에 있는지 체크해주는 함수라 orderList를 넘겨줌

    // // 재고가 충분하지 않는 아이템이 있었다 => 에러
    // if (insufficientStockItems.length > 0) {
    //   //여기에 하나라도 아이템이 들어있으면 에러
    //   const errorMessage = insufficientStockItems.reduce(
    //     (total, item) => (total += item.message), // 스톡아이템에 들어있는 에러 메시지만 뽑아옴
    //     ''
    //   );
    //   throw new Error(errorMessage);
    // }
    //order를 만들자!
    const newOrder = new Order({
      
      userId,
      totalPrice,
      shipTo,
      contact,
      items: orderList,
      orderNum : randomStringGenerator()
    });

    await newOrder.save();

    res.status(200).json({status:"success", orderNum: newOrder.orderNum}); // 주문이 끝나면 주문번호를 받아야함
  } catch (error) {
    return res.status(400).json({status:"fail", error : error.message})

  } 
};

orderController.getOrder = async (req, res, next) => {
  try {
    const { userId } = req;

    const orderList = await Order.find({ userId: userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
        select: "image name",
      },
    });
    const totalItemNum = await Order.countDocuments({ userId: userId });

    const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
    res.status(200).json({ status: "success", data: orderList, totalPageNum });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.getOrderList = async (req, res, next) => {
  try {
    const { page, ordernum } = req.query;

    let cond = {};
    if (ordernum) {
      cond = {
        orderNum: { $regex: ordernum, $options: "i" },
      };
    }

    const orderList = await Order.find(cond)
      .populate("userId")
      .populate({
        path: "items",
        populate: {
          path: "productId",
          model: "Product",
          select: "image name",
        },
      })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);
    const totalItemNum = await Order.find(cond).countDocuments();

    const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
    res.status(200).json({ status: "success", data: orderList, totalPageNum });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    if (!order) throw new Error("Can't find order");

    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;
