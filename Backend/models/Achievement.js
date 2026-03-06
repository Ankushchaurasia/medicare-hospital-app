const mongoose = require('mongoose');
module.exports = mongoose.model('Achievement', new mongoose.Schema({
  title: String, description: String, icon: String
}));