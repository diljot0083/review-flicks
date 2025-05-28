import express from 'express';
import Contact from '../model/Contact.js';

const routerContact = express.Router();

// POST a new contact submission
routerContact.post('/', async (req, res) => {
  console.log("Incoming Contact Form:", req.body); 
  try {
    const { name, email, phone, suggestion } = req.body;
    const newContact = new Contact({
      name,
      email,
      phone,
      suggestion,
    });

    await newContact.save();
    res.status(201).json(newContact);
  } catch (err) {
    console.error('Error saving contact form:', err);
    res.status(500).json({ message: 'Failed to submit contact form' });
  }
});

// GET all contact submissions
routerContact.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default routerContact;