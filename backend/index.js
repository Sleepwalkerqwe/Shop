const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const helmet = require("helmet");
const { globalLimiter } = require("./src/utils/globalLimiter");
// const xss = require("xss-clean");

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

app.use(helmet()); // Защита от XSS, Clickjacking, sniffing и др.
app.use(globalLimiter);
// app.use(xss());

// all routes
const userRoutes = require("./src/users/userRoute");
const productRoutes = require("./src/products/productRoute");
const reviewRoutes = require("./src/reviews/reviewRoute");
const orderRoutes = require("./src/orders/ordersRoute");
const statsRoutes = require("./src/stats/statsRoute");
const dealsRoutes = require("./src/deal/dealsRoute");
const authRoutes = require("./src/auth/authRoute");
// image upload
const uploadImage = require("./src/utils/uploadImage");

// all routes
app.use("/api/auth", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/deal", dealsRoutes);
app.use("/auth-check", authRoutes);

app.get("/", (req, res) => {
  res.status(200).send("hello from backend");
});

async function startServer() {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to DB successfully ✅");

    app.listen(port, () => {
      console.log(`listening on port - ${port}`);
    });
  } catch (err) {
    console.log(`database error - ${err} ❌`);
  }
}

startServer();
app.post("/uploadImage", (req, res) => {
  uploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err));
});
