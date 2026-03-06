const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Superadmin', 'Admin'], default: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);