const User = require('../models/User');
const bcrypt = require("bcryptjs");

const userController={}

userController.createUser=async(req,res) => {
  try{
    let {email, password, name, level, DeterminationWord, PhoneNumber, department,studentNumber, InterestTag,temperature} = req.body // 여기에 추가정보 들어가야 함
    const user = await User.findOne({email}) // user 찾아줘 가입된 유저를
    if(user){
      throw new Error("유저가 이미 존재합니다.")
    }
    const salt = await bcrypt.genSaltSync(10)
    password = await bcrypt.hash(password,salt)
    const newUser = new User({email, password, name, level:level?level:'customer', DeterminationWord, PhoneNumber, department,studentNumber, InterestTag,temperature})
    await newUser.save()
    return res.status(200).json({status:"success"});
  } catch(error){
    res.status(400).json({status:"fail", error:error.message});
  }
}

userController.getUser=async(req,res) => {
  try{
    const {userId} = req;
    const user = await User.findById(userId).populate("likedProducts");
    if(user){
      return res.status(200).json({status:"success", user})
    }
    throw new Error("Invalid token")
  }catch(error){
    res.status(400).json({status:"fail", error:error.message})
  }
}

userController.toggleLike = async (req, res) => {
  try {
    const { userId } = req; // 토큰에서 추출한 유저 ID
    const { productId } = req.body; // 좋아요를 토글할 게시물 ID

    const user = await User.findById(userId);
    if (!user) throw new Error("유저를 찾을 수 없습니다.");

    const post = await Post.findById(productId);
    if (!post) throw new Error("게시물을 찾을 수 없습니다.");

    const isLiked = user.likedProducts.includes(productId);

    if (isLiked) {
      // 이미 좋아요 상태라면 제거
      user.likedProducts = user.likedProducts.filter((id) => id.toString() !== productId);
      post.likes = Math.max(0, post.likes - 1); // 좋아요 수 감소, 0 이하로 내려가지 않게 제한
    } else {
      // 좋아요 추가
      user.likedProducts.push(productId);
      post.likes += 1; // 좋아요 수 증가
    }

    await user.save();
    await post.save();

    res.status(200).json({
      status: "success",
      liked: !isLiked,
      likes: post.likes, // 좋아요 수 반환
      likedProducts: user.likedProducts,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};


userController.getLikedProducts = async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId).populate("likedProducts"); // likedProducts를 참조하여 게시물 정보 가져오기
    if (!user) throw new Error("유저를 찾을 수 없습니다.");

    res.status(200).json({
      status: "success",
      likedProducts: user.likedProducts,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

userController.increaseTemperature = async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.temperature += 1; // 온도 증가
    await user.save();

    res.status(200).json({
      status: "success",
      temperature: user.temperature,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};


userController.updateTemperature = async (req, res) => {
  try {
    const { userId } = req;
    const { temperature } = req.body; // 클라이언트에서 전달된 temperature 값

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    user.temperature += 1;
    user.temperature = temperature; // 값 업데이트
    await user.save();

    res.status(200).json({
      status: "success",
      temperature: user.temperature,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports=userController;
//
//router.post("/",userController.createUser) 이것처럼
//router에 쓰이는 매개변수 두번째 값은 req res를 받음
//async는 try catch 넣는것이 좋다
