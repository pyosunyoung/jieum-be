const express = require("express")
const authController = require('../controllers/auth.controller')
const orderController = require("../controllers/order.controller");
const router = express.Router()

router.post("/", authController.authenticate ,orderController.createOrder) ;
// /api/order 이런 구조가 되어지느 ㄴ거임
router.get("/me", authController.authenticate, orderController.getOrder);
router.get("/", authController.authenticate, orderController.getOrderList);
router.put(
  "/:id",
  authController.authenticate,
  authController.checkAdminPermission,
  orderController.updateOrder
);
module.exports = router;