

const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// 1. LOGIN (WITH MASTER KEY)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 🟢 EMERGENCY MASTER KEY: Ye aapko hamesha 100% login karwayega
    if (email === 'admin@ceo.com' && password === 'superadmin123') {
      let masterAdmin = await Admin.findOne({ email: 'admin@ceo.com' });
      
      // Agar database me nahi hai, to naya bana dega
      if (!masterAdmin) {
        masterAdmin = new Admin({ email: 'admin@ceo.com', password: 'superadmin123', role: 'Superadmin' });
      } else {
        // Agar pehle se hai lekin password galat tha, to use theek kar dega
        masterAdmin.password = 'superadmin123';
        masterAdmin.role = 'Superadmin';
      }
      await masterAdmin.save();
      return res.status(200).json({ success: true, admin: masterAdmin });
    }

    // Normal Login Check (Baki staff ke liye)
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const firstAdmin = new Admin({ email, password, role: 'Superadmin' });
      await firstAdmin.save();
      return res.status(200).json({ success: true, admin: firstAdmin });
    }

    const admin = await Admin.findOne({ email, password });
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid Email or Password' });
    
    res.status(200).json({ success: true, admin });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// 2. GET ALL ADMINS
router.get('/all', async (req, res) => {
  try { const admins = await Admin.find().sort({ createdAt: -1 }); res.status(200).json(admins); } 
  catch (error) { res.status(500).json({ success: false }); }
});

// 3. ADD NEW ADMIN
router.post('/add', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already exists!' });
    
    const newAdmin = new Admin({ email, password, role });
    await newAdmin.save();
    res.status(201).json({ success: true, admin: newAdmin });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// 4. TOGGLE ROLE
router.put('/toggle-role/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    admin.role = admin.role === 'Superadmin' ? 'Admin' : 'Superadmin';
    await admin.save();
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
});

// 5. DELETE ADMIN
router.delete('/delete/:id', async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
});

module.exports = router;