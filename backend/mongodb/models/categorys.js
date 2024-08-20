const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  comics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comic' }]  // Array of comic IDs
});

module.exports = mongoose.model('Category', CategorySchema);
