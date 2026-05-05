const express = require("express");
const router = express.Router();
const razorpay = require("../config/razorpay");
const Order = require("../models/Order"); // make sure this exists

// ================= CREATE RAZORPAY ORDER =================
router.post("/create", async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "OrderId required" });
    }

    // 🔥 Fetch order from DB
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Use DB total (NOT frontend)
    const amount = Math.round(order.total * 100); // convert to paise

    console.log("Order Total:", order.total);
    console.log("Razorpay Amount:", amount);

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: orderId,
    });

    res.json(razorpayOrder);

  } catch (err) {
    console.error("CREATE PAYMENT ERROR:", err);
    res.status(500).json({ message: "Payment creation failed" });
  }
});


// ================= VERIFY PAYMENT =================
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // 🔥 (Basic version — signature verification can be added later)

    await Order.findByIdAndUpdate(orderId, {
      status: "paid",
      paymentId: razorpay_payment_id,
    });

    res.json({ success: true });

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ message: "Verification failed" });
  }
});

module.exports = router;