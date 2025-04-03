const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const authenticateAPIRequest = require("../middleware/auth");

// Get all categories
router.get("/", authenticateAPIRequest, async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching categories" });
    }
});

// Create a new category
router.post("/", authenticateAPIRequest, async (req, res) => {
    try {
        const { name, uid } = req.body;
        if (!name || !uid) {
            return res.status(400).json({ message: "Name and UID are required" });
        }

        const existingCategory = await Category.findOne({ uid });
        if (existingCategory) {
            return res.status(400).json({ message: "Category UID already exists" });
        }

        const category = new Category({ name, uid });
        await category.save();

        res.status(201).json({ message: "Category added successfully", category });
    } catch (error) {
        res.status(500).json({ error: "Server error while creating category" });
    }
});

module.exports = router;
