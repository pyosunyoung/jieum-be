const Post = require('../models/Post');

const PAGE_SIZE = 5; // 한페이지당 최대 5개 게시글이 들어가는 것 5개 이상시 다음 페이지로 넘어감
const postController = {};

postController.createPost = async (req, res) => {
  try {
    const {
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
      pushcategory
    } = req.body;
    const post = new Post({
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
      pushcategory
    });

    await post.save();
    res.status(200).json({ status: 'success', post });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

postController.getPost = async (req, res) => {
  try {
    // query 검색 작업 추가, 검색 조건 추가 고려해서 검색 조건 모아서 설정해보자
    const { page, name } = req.query;
    // if(name){
    //   const post = await Post.find({name:{$regex:name, $options:"i"}}); // 예를들어 jaket을 검색하면 딱 그 jaket이란 단어뿐만 아니라 관련단어도 검색되어지게 설정하고 i는 영어로 칠때 대소문자 구문상관없이 검색되어지게 하는 것인듯
    // }else{
    //   const post = await Post.find({}); // 네임이 없으면 저체 보여줌
    // }

    // 검색 조건 추가 고려해서 검색 조건 모아서 설정해보자
    const cond = name
      ? { name: { $regex: name, $options: 'i' } }
      : { isDeleted: false };
    let query = Post.find(cond); // 선언
    let response = { status: 'success' };
    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE); // skip하고 싶은 데이터의 값을 스킵, 10개의 데이터가 있으면 한페이지당 5개만 보여주고 싶다 limit사용
      //최종 몇개 페이지
      // 데이터가 총 몇개있는지
      const totalItemNum = await Post.find(cond).countDocuments(); // count는 예로 제킷을 검색했을 때 결과값을 숫자로 알려줌
      // 데이터 총 개수 / PAGE_SIZE
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
    } // limit 받고 싶은 데이터 몇개까지만 보낼지, 5개만 보내겠다.,
    // , 페이지 2일땐 5개스킵 후 5개 보여줌, 페이지 3일때 10개 스킵하고 5개 보여줌 1 2 3  1 2에서 10개 스킵 후 3에서 5개 보여주는 구조
    // 5개를 고정적으로 보여주는 것
    const postList = await query.exec(); // 위에서 만든 query를 따로 실행시켜주는 것
    //const post = await Post.find({}) // 전체를 찾아줘
    response.data = postList;
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

postController.updatePost = async (req, res) => {
  try {
    // 프론트엔드에서 id값을 가져와야 함, id값
    const postId = req.params.id; // post api에서 url을 id로 설정해서 가져온것
    const {
      sku,
      name,
      size,
      image,
      price,
      description,
      category,
      stock,
      status,
      pushcategory
    } = req.body;

    const post = await Post.findByIdAndUpdate(
      { _id: postId },
      { sku, name, size, image, price, description, category, stock, status,pushcategory },
      { new: true } // 새로운 값 업데이트
    );
    if (!post) throw new Error('게시글이 존재하지 않습니다.');
    res.status(200).json({ status: 'sucess', data: post });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

postController.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndUpdate(
      { _id: postId },
      { isDeleted: true }
    );
    if (!post) throw new Error('No item found');
    res.status(200).json({ status: 'success' });
  } catch (error) {
    return res.status(400).json({ status: 'fail', error: error.message });
  }
};

postController.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) throw new Error('No item found');
    res.status(200).json({ status: 'success', data: post });
  } catch (error) {
    return res.status(400).json({ status: 'fail', error: error.message });
  }
};
postController.checkStock = async (item) => {
  // 내가 사려는 아이템 재고 정보 들고 오기
  const post = await Post.findById(item.postId);
  // 내가 사려는 아이템 qty, 재고 비교
  if (post.stock[item.size] < item.qty) {
    //item은 내가 사고싶은 것 , post.stock은 현재 재고임
    // 재고가 불충분하면 불충분 메세지와 함께 데이터 반환
    return {
      isVerify: false,
      message: `${post.name}의 ${item.size}재고가 부족합니다`,
    };
  }

  const newStock = { ...post.stock };
  newStock[item.size] -= item.qty;
  post.stock = newStock;

  await post.save();
  // 충분하다면, 재고에서 - qty => 성공
  return { isVerify: true }; // isVerify가 true면 성공
};
// checkItemListStock 전체 리스트 체크
postController.checkItemListStock = async (itemList) => {
  const insufficientStockItems = []; // 재고가 불충분한 아이템을 저장할 예정
  //재고 확인 로직
  await Promise.all( // 비동기를 한번에 처리하는 것 promiseall, await가 상당히 많아서 빠르게 처리하기 위해 promise all을 사용
    itemList.map(async (item) => {
      const stockCheck = await postController.checkStock(item); // checkStock()아이템 하나하나 체크
      if (!stockCheck.isVerify) {
        insufficientStockItems.push({ item, message: stockCheck.message }); //불충분 재고를 넣어줌
      }
      return stockCheck;
    })
  ); 

  return insufficientStockItems;
};

module.exports = postController;
