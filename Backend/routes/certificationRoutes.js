const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Certification = require('../models/Certification');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-cert-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage: storage });


router.post('/add', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image required' });
    const imageUrl = `${process.env.API_URL}/uploads/${req.file.filename}`;
    
    const newCert = new Certification({ title: req.body.title, image: imageUrl });
    await newCert.save();
    res.status(201).json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get('/all', async (req, res) => {
  try {
    const certs = await Certification.find().sort({ createdAt: -1 });
    res.status(200).json(certs);
  } catch (error) { res.status(500).json({ success: false }); }
});


router.put('/toggle/:id', async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    cert.isVisible = !cert.isVisible;
    await cert.save();
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await Certification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
});

module.exports = router;