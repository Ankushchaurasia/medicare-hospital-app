

const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  image: { type: String, required: true },
  successRate: { type: String },
  experience: { type: String, required: true },
  qualifications: { type: String, required: true },
  location: { type: String, required: true },
  fee: { type: Number, required: true },
  about: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  adminEmail: { type: String } // 👈 NAYA FIELD: Ye yaad rakhega ki kis admin ne ye profile banayi hai
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);