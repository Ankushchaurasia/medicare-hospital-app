

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const SiteContent = require('../models/SiteContent');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    if (file.fieldname === 'logo') cb(null, 'logo.png');
    else if (file.fieldname === 'banner') cb(null, 'banner.png');
    else cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post('/upload-logo', upload.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Upload a logo' });
  res.status(200).json({ success: true, message: 'Logo Updated!' });
});

router.post('/upload-banner', upload.single('banner'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Upload a banner' });
  res.status(200).json({ success: true, message: 'Banner Updated!' });
});


router.get('/content', async (req, res) => {
  try {
    let content = await SiteContent.findOne();
    if (!content) { content = await SiteContent.create({}); }
    res.status(200).json(content);
  } catch (err) { res.status(500).json({ success: false }); }
});

router.post('/content/update', async (req, res) => {
  try {
    let content = await SiteContent.findOne();
    if (!content) content = new SiteContent(req.body);
    else {
      content.heroTitle = req.body.heroTitle;
      content.heroSubtitle = req.body.heroSubtitle;
      content.emergencyNumber = req.body.emergencyNumber;
    }
    await content.save();
    res.status(200).json({ success: true });
  } catch (err) { res.status(500).json({ success: false }); }
});

module.exports = router;