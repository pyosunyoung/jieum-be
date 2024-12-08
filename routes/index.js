const express = require("express");
const router = express.Router();
const userApi = require("./user.api");
const authApi = require("./auth.api");
const PostApi = require("./Post.api");
const cartApi = require("./cart.api")
const orderApi = require("./order.api")
router.use("/user", userApi); //  데이터를 우선 만들자
router.use("/auth", authApi);
router.use("/product", PostApi);
router.use("/cart",cartApi);
router.use("/order", orderApi);
module.exports = router; // app.js에서 사용됨 이건