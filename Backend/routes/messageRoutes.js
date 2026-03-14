const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.post('/send', async (req, res) => {
  try {
    const newMsg = new Message(req.body);
    await newMsg.save();
    res.status(201).json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/all', async (req, res) => {
  try {
    const msgs = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(msgs);
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});


router.put('/mark-read/:id', async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false }); }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const Message = require('../models/Message'); // Model import
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Message Deleted' });
  } catch (error) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
});
module.exports = router;