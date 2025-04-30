const express = require("express");
const Order = require("./OrdersModel");
const verifyToken = require("../middleware/verifyToken");
const { verifyAdmin } = require("../middleware/virifyAdmin");
const Product = require("../products/ProductModel");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// create checkout session
router.post("/create-checkout-session", verifyToken, async (req, res) => {
  const { products } = req.body;

  try {
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image],
          metadata: {
            productId: product._id.toString(),
          },
        },

        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,

      // success_url: `https://shop-lovat-seven.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `https://shop-lovat-seven.vercel.app/cancel`,
      customer_email: req.email,
      customer_creation: "always",
    });
    console.log("user - ", req.body);
    res.json({
      id: session.id,
    });
  } catch (err) {
    console.error("Error creating checkout session", err);
    res.status(500).send({ message: "Failed to create checkout session", err: err.message });
  }
});

// confirm payment

router.post("/confirm-payment", verifyToken, async (req, res) => {
  const { session_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent", "line_items.data.price.product"],
    });

    const paymentIntentId = session.payment_intent.id;
    let order = await Order.findOne({ orderId: paymentIntentId });

    if (!order) {
      const lineItems = session.line_items.data.map((item) => ({
        productId: item.price.product.metadata.productId,
        quantity: item.quantity,
      }));

      const amount = session.amount_total / 100;
      order = new Order({
        orderId: paymentIntentId,
        amount,
        products: lineItems,
        email: session.customer_details.email,
        status: session.payment_intent.status === "succeeded" ? "pending" : "failed",
      });
    } else {
      order.status = session.payment_intent.status === "succeeded" ? "pending" : "failed";
    }
    await order.save();
    res.json({ order });
  } catch (err) {
    console.error("Erorr confirming payment", err);
    res.status(500).send({ message: "Error confirming payment" });
  }
});

router.get("/:email", async (req, res) => {
  const email = req.params.email;
  if (!email) return res.status(404).send({ message: "Email is required" });
  try {
    const orders = await Order.find({ email: email });
    if (orders.length === 0 || !orders) return res.status(400).send({ order: 0, message: "No orders found for this email" });

    res.status(200).send({ orders });
  } catch (err) {
    console.error("Error getting orders by email", err);
    res.status(500).send({ message: "Failed getting orders by email" });
  }
});

// get order by id
router.get("/order/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(400).send({ order: 0, message: "No orders found for this id" });
    console.log("order", order);

    const productIds = order.products.map((p) => p.productId);

    const products = await Product.find({ _id: { $in: productIds } });
    console.log(products);
    res.status(200).send({ order, products });
  } catch (err) {
    console.error("Error getting orders by user id", err);
    res.status(500).send({ message: "Failed getting orders by user id" });
  }
});

// get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    if (orders.length === 0) return res.status(400).send({ orders: [], message: "No orders found" });

    res.status(200).send(orders);
  } catch (err) {
    console.error("Error getting orders", err);
    res.status(500).send({ message: "Failed getting orders" });
  }
});

// update order status
router.get("/update-order-status", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).send({ orders: [], message: "Status is required" });
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: True, runValidators: true });
    if (!updatedOrder) return res.status(400).send({ orders: [], message: "Order not found" });

    res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
  } catch (err) {
    console.error("Error updating order status", err);
    res.status(500).send({ message: "Failed updating order status" });
  }
});

// delete order
router.delete("/delete-order/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) return res.status(400).send({ orders: [], message: "order not found" });

    res.status(200).json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (err) {
    console.error("Error deleting order", err);
    res.status(500).send({ message: "Failed to delete order" });
  }
});

module.exports = router;
