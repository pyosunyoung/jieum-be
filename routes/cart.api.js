const express = require("express");
const authController = require('../controllers/auth.controller');
const cartController = require('../controllers/cart.controller');
const router = express.Router()

router.post("/",authController.authenticate ,cartController.addItemToCart) // login한 유저만 카트 추가 가능하게 설정(토큰값 읽어옴)
router.get("/",authController.authenticate ,cartController.getCart) // 내꺼 카트를 가져오기 위해 로그인 토큰값을 통해 ㄲauthenticate그래서 미들웨어로 필요
router.delete(
  "/:id",
  authController.authenticate,
  cartController.deleteCartItem
);
router.put("/:id", authController.authenticate, cartController.editCartItem);
router.get("/qty", authController.authenticate, cartController.getCartQty);

module.exports = router;