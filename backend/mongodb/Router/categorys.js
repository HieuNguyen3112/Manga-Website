const express = require('express');
const router = express.Router();
const Category = require('../models/categorys');  // Ensure this path is correct

// Fetch all categories
router.get('/', async (req, res) => {
  try {
    // console.log('Fetching all categories');
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// Fetch comics by category
router.get('/by-category/:categoryId', async (req, res) => {
  try {
    console.log(`Fetching comics for category ID: ${req.params.categoryId}`);
    const comics = await Comic.find({ category: req.params.categoryId });
    res.status(200).json(comics);
  } catch (error) {
    console.error('Error fetching comics:', error.message);
    res.status(500).json({ message: 'Error fetching comics', error: error.message });
  }
});

module.exports = router;
