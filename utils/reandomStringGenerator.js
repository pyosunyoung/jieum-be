const randomStringGenerator = () => {
  const randomString = Array.from(Array(10), () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join(""); // 랜덤 스트링 출력


  return randomString
} // orderNum 만들때 씀

module.exports = {randomStringGenerator};
