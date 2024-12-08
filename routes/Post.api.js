const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();
const postController = require('../controllers/post.controller');
router.post(
  '/',
  authController.authenticate,
  authController.checkAdminPermission,
  postController.createPost
);
// product상품은 관리자인 admin만 생성가능 그래서
// admin유저인지 아닌지를 확인해야 함 미들웨어 느낌 checkAdminPermission,

router.get('/', postController.getPost); // getpost admin 페이지, 모든 페이지에서도 쓰임
router.put(
  '/:id',
  authController.authenticate,
  authController.checkAdminPermission, // 고객이 맘대로 수정하지 못하게 권한 설정
  postController.updatePost
); // 상품 id가져와서 해당 id수정하는 느낌

router.delete(
  "/:id",
  authController.authenticate,
  authController.checkAdminPermission,
  postController.deletePost
);

router.get("/:id", postController.getPostById);
module.exports = router;
