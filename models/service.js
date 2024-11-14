const mongoose = require('mongoose');

// Define the schema for the service
const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  }
});

// Create a model from the schema
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
