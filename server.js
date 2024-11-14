require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Service = require('./models/service');

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 1. Add a new service
app.post('/services', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newService = new Service({ name, description, price });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. Get all services
app.get('/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 3. Update a service
app.put('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const updatedService = await Service.findByIdAndUpdate(id, { name, description, price }, { new: true });
    if (!updatedService) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    res.status(200).json(updatedService);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 4. Delete a service
app.delete('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    res.status(200).json({ message: 'Service deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
