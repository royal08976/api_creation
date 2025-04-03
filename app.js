require("dotenv").config();

console.log("✅ Checking ENV Variables...");
console.log("MONGODB_URL:", process.env.MONGODB_URL);
console.log("JWT_SECRET:", process.env.JWT_SECRET);


console.log("✅ Checking ENV Variables...");
console.log("MONGODB_URL:", process.env.MONGODB_URL);
console.log("JWT_SECRET:", process.env.JWT_SECRET);



const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const connectDB = require("./db/connect");

const app = express();
const port = process.env.PORT || 5000;
const host = "0.0.0.0"; // Ensure accessibility over LAN

// Import Routes
const products_routes = require("./routes/products");
const auth_routes = require("./routes/auth");
const category_routes = require("./routes/category"); // New category routes

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors()); // Optionally configure: app.use(cors({ origin: "http://your-frontend.com" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Routes
app.get("/", (req, res) => {
    res.send("Hi, I am live!");
});

app.use("/api/auth", auth_routes);
app.use("/api/products", products_routes);
app.use("/api/categories", category_routes); // New category routes

// Image Upload Route
app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Start server
const start = async () => {
    try {
        await connectDB(); // No need to pass MONGODB_URL, already handled in connectDB.js
        app.listen(port, host, () => {
            console.log(`✅ Server running on: http://${host}:${port}`);
        });
    } catch (error) {
        console.error("❌ Error starting the server:", error.message);
        process.exit(1); // Exit on critical error
    }
};

start();
