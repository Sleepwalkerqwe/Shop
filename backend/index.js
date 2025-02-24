const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const port = process.env.PORT || 5000;

// middleware setup
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// all routes
const authRoutes = require("./src/users/userRoute");

app.use("/api/auth", authRoutes);

async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("connected to DB successfuly ✅");
  } catch (err) {
    console.log(`database error - ${err} ❌`);
  }
}
app.get("/", (req, res) => {
  console.log("get request - 200");
  res.send("Hello world");
});

app.listen(port, () => {
  connectDB();
  console.log(`listening on port - ${port}`);
});
