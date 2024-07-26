const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("../mongodb/Router/auth");

const app = express();
dotenv.config();

const connectToMongo = async () => {
  try {
      await mongoose.connect(process.env.MONGODB_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB");
  } catch (error) {
      console.error("Failed to connect to MongoDB", error);
  }
};

connectToMongo();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//Routes
app.use("/v1/auth", authRoute);

//Chức năng login: so sánh dữ liệu nhập từ form của người dùng với database


//Phân quyền

app.listen(8000, ()=> {
    console.log("Server is running!");
});

