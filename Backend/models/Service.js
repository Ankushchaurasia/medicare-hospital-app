const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  department: { type: String, required: true }, 
  price: { type: Number, required: true }, 
  image: { type: String, required: true }, 
  status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);