const express = require("express");
const User = require("../users/UserModel");
const Order = require("../orders/OrdersModel");
const Review = require("../reviews/ReviewModel");
const Product = require("../products/ProductModel");
const router = express.Router();

// user stats by email
router.get("/user-stats/:email", async (req, res) => {
  const { email } = req.params;
  if (!email) return res.status(400).send({ message: "Email is required" });

  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).send({ message: "User not found" });
    // console.log(user);

    // sum of all orders
    const totalPaymentsResult = await Order.aggregate([{ $match: { email: email } }, { $group: { _id: null, totalSum: { $sum: "$amount" } } }]);

    const totalPaymentsSum = totalPaymentsResult.length > 0 ? totalPaymentsResult[0].totalSum : 0;

    // get total review
    const totalReviews = await Review.countDocuments({ userId: user._id });

    //total purchased products
    const purchasedProductIds = await Order.distinct("products.productId", { email: email });
    const totalPurchasedProducts = purchasedProductIds.length;

    return res.status(200).send({ totalPayments: totalPaymentsSum.toFixed(2), totalReviews, totalPurchasedProducts });
  } catch (err) {
    console.log(`error getting user stats -${err}`);
    res.status(500).send({ message: "Error to get user stats" });
  }
});

// admin status
router.get("/admin-stats", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalUsers = await User.countDocuments();

    // calculate total earning
    const totalEarnigsResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$amount" },
        },
      },
    ]);
    const totalEarnings = totalEarnigsResult.length > 0 ? totalEarnigsResult[0].totalEarnings : 0;

    const monthlyEarningResult = await Order.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          monthlyEarnings: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // formate monthly earnings
    const monthlyEarnings = monthlyEarningResult.map((entry) => ({
      month: entry._id.month,
      year: entry._id.year,
      earnings: entry.monthlyEarnings.toFixed(2),
    }));
    res.status(200).json({
      totalOrders,
      totalProducts,
      totalReviews,
      totalUsers,
      totalEarnings,
      monthlyEarnings,
    });
  } catch (err) {
    console.log(`error getting user stats -${err}`);
    res.status(500).send({ message: "Error to get user stats" });
  }
});
module.exports = router;
