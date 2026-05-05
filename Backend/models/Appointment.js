const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: String },
  gender: { type: String },
  doctorName: { type: String },  
  department: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  fee: { type: String },         
  paymentMethod: { type: String, default: 'Cash' }, 
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);