const express = require("express");
const Review = require("./ReviewModel");
const Product = require("../products/ProductModel");
const router = express.Router();

// post a new review
router.post("/create-review", async (req, res) => {
  try {
    const { comment, rating, productId, userId } = req.body;
    if (!comment || !rating || !productId || !userId) return res.status(400).send({ message: "All fields are required" });
    const existingReview = await Review.findOne({ productId, userId });

    if (existingReview) {
      existingReview.comment = comment;
      existingReview.rating = rating;
      await existingReview.save();
    } else {
      const newReview = new Review({
        comment,
        rating,
        productId,
        userId,
      });
      await newReview.save();
    }

    // calculate the average rating
    const review = await Review.find({ productId });

    if (review.length > 0) {
      const totalRating = review.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / review.length;
      const product = await Product.findById(productId);

      if (product) {
        product.rating = averageRating;
        await product.save({ validateBeforeSave: false });
      } else return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({ message: "Review processed successfully" }, review);
  } catch (err) {
    console.error("Error posting review", err);
    res.status(500).send({ message: "failed to post review" });
  }
});

// get all reviews count
router.get("/total-reviews", async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments({});
    res.status(200).send({ totalReviews });
  } catch (err) {
    console.error("Error getting reviews", err);
    res.status(500).send({ message: "failed to get reviews" });
  }
});

// get reviews by userId
router.get("/:userId", async (req, res) => {
  const {} = req.params;
  if (!userId) return res.status(400).send({ message: "All fields are required" });

  try {
    const reviews = await Review.find({ userId: userId }).sort({ createdAt: -1 });
    if (reviews.length === 0) return res.status(404).send({ message: "No reviews found" });

    res.status(200).send(reviews);
  } catch (err) {
    console.error("Error getting reviews by user", err);
    res.status(500).send({ message: "failed to get reviews by user" });
  }
});
module.exports = router;
