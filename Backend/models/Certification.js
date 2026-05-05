const mongoose = require('mongoose');

const certSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, 
  isVisible: { type: Boolean, default: true } 
}, { timestamps: true });

module.exports = mongoose.model('Certification', certSchema);