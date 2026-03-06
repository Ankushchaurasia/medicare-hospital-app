const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Heart Rating"
  department: { type: String, required: true }, // e.g., "Cardiology"
  price: { type: Number, required: true }, // e.g., 1200
  image: { type: String, required: true }, // सर्विस की फोटो
  status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);