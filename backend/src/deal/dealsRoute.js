const express = require("express");
const Deal = require("./DealsModel");

const router = express.Router();

// create checkout session
router.get("/", async (req, res) => {
  try {
    const deal = await Deal.findOne(); // Получаем текущую акцию
    res.json(deal);
  } catch (err) {
    res.status(500).send("Error fetching deal");
  }
});

router.post("/create", async (req, res) => {
  try {
    const { title, description, endDate } = req.body;

    if (!title || !description || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newDeal = new Deal({
      title,
      description,
      endDate,
    });

    const savedDeal = await newDeal.save();

    res.status(201).json({
      message: "Deal created successfully",
      deal: savedDeal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating deal" });
  }
});

module.exports = router;
