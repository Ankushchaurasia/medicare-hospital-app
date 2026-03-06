const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  reviewText: { type: String, required: true },
  rating: { type: Number, default: 5 },
  image: { type: String } // 👈 Photo ke liye naya field
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);