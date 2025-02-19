const express = require("express");
const Product = require("./ProductModel");
const Review = require("../reviews/ReviewModel");
const verifyToken = require("../middleware/verifyToken");
const { verifyAdmin } = require("../middleware/virifyAdmin");
const router = express.Router();

// post a product
router.post("/create-product", async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
    });

    const savedProduct = await newProduct.save();

    // calculate reviews

    const reviews = await Review.find({ productId: savedProduct._id });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

      const avarageRating = totalRating / reviews.length;

      savedProduct.rating = avarageRating;
      await savedProduct.save();
    }

    res.status(201).send(savedProduct);
  } catch (err) {
    console.error("Erorr creating new product", error);
    res.status(500).send({ message: "Error creating new product" });
  }
});

// get all product
router.get("/", async (req, res) => {
  try {
    const { category, color, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (category && category !== "all") filter.category = category;
    if (color && color !== "all") filter.color = color;
    if (minPrice && maxPrice) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && !isNaN(max)) filter.price = { $gte: min, $lte: max };
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalProducts = await Product.countDocuments(filter);

    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    const products = await Product.find(filter).skip(skip).limit(parseInt(limit)).populate("author", "email").sort({ createdAt: -1 });

    res.status(200).send({ products, totalPages, totalProducts });
  } catch (err) {
    console.error("Error getting products", err);
    res.status(500).send({ message: "Error getting products" });
  }
});

// get single Product

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("author", "email userName");

    if (!product) return res.status(404).send({ message: "Product not found" });

    const reviews = await Review.find({ productId }).populate("userId", "email userName");
    res.status(200).send({ product, reviews });
  } catch (err) {
    console.error("Error getting product", err);
    res.status(500).send({ message: "Error getting product" });
  }
});

// update product
router.patch("/update-product/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(productId, { ...req.body }, { new: true });

    if (!updatedProduct) return res.status(404).send({ message: "Product not found" });
    res.status(200).send({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.err("Error updating product", err);
    res.status(500).send({ message: "Error updating product" });
  }
});

// delete product
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) res.status(404).send({ message: "Product not found" });

    // delete reviews related to the product
    await Review.deleteMany({ productId });

    res.status(200).send({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error getting product", err);
    res.status(500).send({ message: "Error getting product" });
  }
});

// get related products
router.get("/related/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) res.status(404).send({ message: "Product id is not found" });

    const product = await Product.findById(id);
    if (!product) res.status(404).send({ message: "Product  is not found" });

    const titleRegex = new RegExp(
      product.name
        .split(" ")
        .filter((word) => word.length > 1)
        .join("|"),
      "i"
    );

    const relatedProducts = await Product.find({ _id: { $ne: id }, $or: [{ name: { $regex: titleRegex } }, { category: product.category }] });

    res.status(200).send(relatedProducts);
  } catch (err) {
    console.error("Error getting related product", err);
    res.status(500).send({ message: "Error getting related product" });
  }
});
module.exports = router;
