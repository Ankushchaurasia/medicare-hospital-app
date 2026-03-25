const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Review = require('../models/Review');


const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-review-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage: storage });


router.post('/add', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) {
      imageUrl = `${process.env.API_URL}/uploads/${req.file.filename}`;
    }
    const newReview = new Review({
      patientName: req.body.patientName,
      reviewText: req.body.reviewText,
      rating: req.body.rating,
      image: imageUrl
    });
    await newReview.save();
    res.status(201).json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get('/all', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) { res.status(500).json({ success: false }); }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const Review = require('../models/Review'); // Model import
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Review Deleted' });
  } catch (error) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
});

module.exports = router;