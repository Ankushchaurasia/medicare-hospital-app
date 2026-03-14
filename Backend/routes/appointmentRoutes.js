const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');


router.post('/book', async (req, res) => {
  try {
    const newApp = new Appointment(req.body);
    await newApp.save();
    res.status(201).json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});


router.get('/all', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});


router.put('/update/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.status(200).json({ success: true, message: 'Status updated' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get('/patient/:phone', async (req, res) => {
  try {
    const searchNumber = req.params.phone.trim();
    
    const appointments = await Appointment.find({ 
      phone: { $regex: searchNumber, $options: 'i' } 
    }).sort({ createdAt: -1 });
    
    res.status(200).json(appointments);
  } catch (error) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
});

router.get('/track/:phone', async (req, res) => {
  try {
    
    const appointments = await require('../models/Appointment')
        .find({ phone: req.params.phone })
        .sort({ createdAt: -1 }); 
        
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
module.exports = router; 
