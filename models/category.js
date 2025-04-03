const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true }
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
