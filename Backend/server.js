

const express = require('express');
const cors = require('cors');
const path = require('path'); // Photo upload का पाथ सेट करने के लिए
const connectDB = require('./config/db');
require('dotenv').config();

// Express app बनाना
const app = express();

// Database कनेक्ट करना
connectDB();

// Middlewares (ताकि frontend और backend बात कर सकें)
app.use(cors()); 
app.use(express.json()); 

// 📁 Uploads फोल्डर को पब्लिक बनाना (ताकि वेबसाइट पर फोटो दिख सकें)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔗 API Routes (सभी रास्तों को यहाँ जोड़ दिया गया है)
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));

// Basic Test Route
app.get('/', (req, res) => {
  res.send('MediCare Backend API is Running! 🚀');
});

// Port सेट करना
const PORT = process.env.PORT || 5000;

// Server को स्टार्ट करना
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/certifications', require('./routes/certificationRoutes')); // 👈 Nayi line
app.use('/api/admins', require('./routes/adminRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));