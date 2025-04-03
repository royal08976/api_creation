const express = require("express");
const mongoose = require("mongoose"); // Add this line
const Product = require("../models/product"); // Import the correct model

const router = express.Router();
const multer = require("multer");
const path = require("path");
const authenticateAPIRequest = require("../middleware/auth");
const { getAllProducts, getAllProductsTesting, postAllProducts } = require("../controllers/products");

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save images in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Routes
router.get("/", authenticateAPIRequest, getAllProducts);
router.get("/testing", authenticateAPIRequest, getAllProductsTesting);

router.post("/posts", async (req, res) => {
    try {
        console.log("✅ JSON Request received:", req.body);

        const product = await postAllProducts(req, res); // Pass `res` properly
        return product; // Ensure response is sent
    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});



    // 📝 PATCH - Update a product (Admin Only)
router.patch("/:id", authenticateAPIRequest, async (req, res) => {
    try {
        // if (req.user.role !== "admin") {
        //     return res.status(403).json({ success: false, message: "Only admins can update products." });
        // }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "product not found" });
        }

        res.status(200).json({ success: true, message: "product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Update product Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// 🗑️ DELETE - Remove a product (Admin Only)
// Delete a product
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        // Check if product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }

        // Delete the product
        await Product.findByIdAndDelete(id);
        res.json({ success: true, message: "product deleted successfully",deletedProductId: id  });

    } catch (error) {
        console.error("DELETE Error:", error);
        res.status(500).json({ message: "Server error, unable to delete product" });
    }

    
});

router.get("/:id", authenticateAPIRequest, async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔹 Requested product ID:", id);  // Debugging line

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("❌ Invalid product ID Format"); // Debugging line
            return res.status(400).json({ success: false, message: "Invalid product ID format" });
        }

        const product = await Product.findById(id);
        console.log("🔹 Found product:", product); // Debugging line

        if (!product) {
            console.log("❌ product Not Found"); // Debugging line
            return res.status(404).json({ success: false, message: "product not found" });
        }

        res.status(200).json({ success: true, product });

    } catch (err) {
        console.error("❌ Error Fetching product:", err); // Print exact error
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});




    


module.exports = router;
