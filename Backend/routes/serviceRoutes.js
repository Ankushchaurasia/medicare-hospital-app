const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Service = require('../models/Service');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage: storage });


router.post('/add', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a photo!' });
    
    const imageUrl = `${process.env.API_URL}/uploads/${req.file.filename}`;
    const newService = new Service({ ...req.body, image: imageUrl });
    await newService.save();
    
    res.status(201).json({ success: true, service: newService });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get('/all', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    res.status(200).json(service);
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await require('../models/Service').findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Service Deleted' });
  } catch (error) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
});
module.exports = router;