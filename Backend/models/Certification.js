const mongoose = require('mongoose');

const certSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // Photo URL
  isVisible: { type: Boolean, default: true } // Enable/Disable Toggle
}, { timestamps: true });

module.exports = mongoose.model('Certification', certSchema);