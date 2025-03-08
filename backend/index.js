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
    origin: ["http://localhost:5173", "https://shop-lovat-seven.vercel.app"],
    credentials: true,
  })
);

// all routes
const authRoutes = require("./src/users/userRoute");
const productRoutes = require("./src/products/productRoute");
const reviewRoutes = require("./src/reviews/reviewRoute");
const orderRoutes = require("./src/orders/ordersRoute");
const statsRoutes = require("./src/stats/statsRoute");

// image upload
const uploadImage = require("./src/utils/uploadImage");

// all routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  console.log(1231231);

  res.status(200).send("hello from backend");
});

async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to DB successfuly ✅");
  } catch (err) {
    console.log(`database error - ${err} ❌`);
  }
}
app.listen(port, () => {
  connectDB();
  console.log(`listening on port - ${port}`);
});

app.post("/uploadImage", (req, res) => {
  uploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err));
});
