const express = require("express");
const Order = require("./OrdersModel");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// create checkout session
router.post("/create-checkout-session", async (req, res) => {
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
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cancel`,
    });

    res.json({
      id: session.id,
    });
  } catch (err) {
    console.error("Error creating checkout session", err);
    res.status(500).send({ message: "Failed to create checkout session" });
  }
});

// confirm payment

router.post("/confirm-payment", async (req, res) => {
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

module.exports = router;
