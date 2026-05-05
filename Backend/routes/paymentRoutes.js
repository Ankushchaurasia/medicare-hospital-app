const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');


const razorpay = new Razorpay({
  key_id: 'rzp_test_YOUR_KEY_HERE',     
  key_secret: 'YOUR_SECRET_KEY_HERE'   
});


router.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, 
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };
    
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment initiation failed' });
  }
});


router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", 'YOUR_SECRET_KEY_HERE') 
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