

const express = require('express');
const cors = require('cors');
const path = require('path'); 
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();


connectDB();

app.use(cors()); 
app.use(express.json()); 


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));


app.get('/', (req, res) => {
  res.send('MediCare Backend API is Running! 🚀');
});


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/certifications', require('./routes/certificationRoutes')); // 👈 Nayi line
app.use('/api/admins', require('./routes/adminRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));