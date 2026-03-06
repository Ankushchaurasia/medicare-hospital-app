const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Razorpay Dashboard se aapko ye Test Keys mil jayengi
const razorpay = new Razorpay({
  key_id: 'rzp_test_YOUR_KEY_HERE',     // 👈 Yahan apni Test Key ID dalein
  key_secret: 'YOUR_SECRET_KEY_HERE'    // 👈 Yahan apna Test Secret dalein
});

// 1. Create Order (Payment Modal open hone se pehle order banta hai)
router.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // ₹1 = 100 Paise (Razorpay paise me calculate karta hai)
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };
    
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment initiation failed' });
  }
});

// 2. Verify Payment (Payment success hone ke baad check karna)
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Security check: Match signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", 'YOUR_SECRET_KEY_HERE') // 👈 Yahan wapas apna Secret dalein
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ success: true, message: "Payment verified successfully!" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid Signature!" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;