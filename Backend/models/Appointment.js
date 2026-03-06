const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: String },
  gender: { type: String },
  doctorName: { type: String },  // Naya add kiya
  department: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  fee: { type: String },         // Naya add kiya
  paymentMethod: { type: String, default: 'Cash' }, // Naya add kiya
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);