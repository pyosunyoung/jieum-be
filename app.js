const express  = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const indexRouter = require("./routes/index")
const app = express();

require("dotenv").config();
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); // req.body가 객체로 인식이 됩니다.

app.use("/api", indexRouter)// url이 api면 indexRouter로 이동
//만약 /api/user라면 파일은 app -> index -> user api이렇게 이동됨
const mongoURI = process.env.LOCAL_DB_ADDRESS
mongoose.connect(mongoURI,{useNewUrlParser:true})
  .then(()=>console.log("mongoose connected"))
  .catch((err)=>console.log("db connection fail", err));

app.listen(process.env.PORT || 5000, () => {
  console.log("servor on");
})