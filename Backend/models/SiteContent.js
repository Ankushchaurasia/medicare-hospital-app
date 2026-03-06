const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  heroTitle: { type: String, default: 'Advanced Healthcare, Compassionate Professionals' },
  heroSubtitle: { type: String, default: 'Book appointments, track your health, and consult with the best specialists in the city.' },
  emergencyNumber: { type: String, default: '+91 7307520789' }
});

module.exports = mongoose.model('SiteContent', siteContentSchema);