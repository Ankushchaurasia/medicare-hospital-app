const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Doctor = require('../models/Doctor'); 


const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-doc-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage: storage });


router.post('/add', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    
    const newDoctor = new Doctor({ ...req.body, image: imageUrl });
    await newDoctor.save();
    res.status(201).json({ success: true, doctor: newDoctor });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});


router.get('/all', async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.status(200).json(doctors);
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});


router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.status(200).json(doctor);
  } catch (error) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
});


router.put('/toggle/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    doctor.isAvailable = !doctor.isAvailable;
    await doctor.save();
    res.status(200).json({ success: true, isAvailable: doctor.isAvailable });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Doctor Deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

module.exports = router;