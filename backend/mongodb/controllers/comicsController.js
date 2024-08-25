const Comic = require('../models/comics_model');
const Category = require('../models/categorys'); // Assuming you have a Category model
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "dwfmpiozq",
  api_key: 698787751885177,
  api_secret: "WbcBy270Rx36KWI3q7jeOXCh4vI"
});

// Create a new comic
exports.createComic = async (req, res) => {
  try {
    const { title, category, author, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Ensure `category` is an array
    const categoryArray = Array.isArray(category) ? category : [category];

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(file.path);

    if (!result.public_id) {
      return res.status(500).json({ message: 'Failed to upload image to Cloudinary. publicId not returned.' });
    }

    // Create a new comic
    const newComic = new Comic({
      title,
      category: categoryArray, // Store category IDs as an array
      author,
      description,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      chapters: [], // Initialize chapters as an empty array
      views: 0,
      likes:0,
      status: 'Đang cập nhật',
      rating: 5,
      creationDate: new Date(),
      updateDate: new Date(),
    });

    const savedComic = await newComic.save();

    // Update the categories to include the new comic
    await Category.updateMany(
      { _id: { $in: categoryArray } },
      { $push: { comics: savedComic._id } }
    );

    res.status(201).json(savedComic);
  } catch (err) {
    console.error('Error creating comic:', err);
    res.status(500).json({ message: 'Error creating comic', error: err.message });
  }
};


// Update an existing comic
exports.updateComic = async (req, res) => {
  try {
    const { title, category, author, description } = req.body;
    const file = req.file;

    const comic = await Comic.findById(req.params.id);

    if (!comic) {
      return res.status(404).json({ message: 'Comic not found.' });
    }

    comic.title = title;
    comic.category = category;
    comic.author = author;
    comic.description = description;
    comic.updateDate = new Date();

    if (file) {
      if (comic.publicId) {
        await cloudinary.uploader.destroy(comic.publicId);
      }

      const result = await cloudinary.uploader.upload(file.path);

      comic.imageUrl = result.secure_url;
      comic.publicId = result.public_id;
    }

    const updatedComic = await comic.save();
    res.status(200).json(updatedComic);
  } catch (err) {
    console.error('Error updating comic:', err);
    res.status(500).json({ message: 'Error updating comic', error: err.message });
  }
};

// Delete a comic
exports.deleteComic = async (req, res) => {
  try {
    const comic = await Comic.findByIdAndDelete(req.params.id);
    if (!comic) {
      return res.status(404).json({ message: 'Comic not found.' });
    }

    if (comic.publicId) {
      await cloudinary.uploader.destroy(comic.publicId);
      console.log('Deleted image from Cloudinary:', comic.publicId);
    }

    res.status(200).json({ message: 'Comic and associated image deleted successfully.' });
  } catch (err) {
    console.error('Error deleting comic:', err);
    res.status(500).json({ message: 'Error deleting comic', error: err.message });
  }
};

// Get all comics
exports.getComics = async (req, res) => {
  try {
    const comics = await Comic.find();

    const comicsWithChapterCount = comics.map(comic => ({
      ...comic._doc,
      chapterCount: (comic.chapters && Array.isArray(comic.chapters)) ? comic.chapters.length : 0,
    }));

    res.status(200).json(comicsWithChapterCount);
  } catch (err) {
    console.error('Error fetching comics:', err);
    res.status(500).json({ message: 'Error fetching comics', error: err.message });
  }
};

// Tìm kiếm truyện theo tiêu đề
exports.searchComics = async (req, res) => {
  try {
      console.log("Search query received:", req.query.search);
      const query = req.query.search;
      if (!query) {
          return res.status(400).json({ message: 'No search query provided.' });
      }

      const comics = await Comic.find({ title: { $regex: query, $options: 'i' } });

      res.status(200).json(comics);
  } catch (err) {
      console.error('Error searching comics:', err);
      res.status(500).json({ message: 'Error searching comics', error: err.message });
  }
};

// Get comic by ID
exports.getComicById = async (req, res) => {
  try {
    const comicId = req.params.id;

    // Tìm truyện theo ID
    const comic = await Comic.findById(comicId);

    if (!comic) {
      return res.status(404).json({ message: 'Comic not found.' });
    }

    res.status(200).json(comic);
  } catch (err) {
    console.error('Error fetching comic:', err);
    res.status(500).json({ message: 'Error fetching comic', error: err.message });
  }
};


