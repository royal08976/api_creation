const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // categoryUid: { // Store only category UID
    //     type: String,
    //     required: false,
    //     ref: "Category"
    // },
    // brand: {
    //     type: String,
    //     required: false,
    // },
    price: {
        type: Number,
        required: true,
    },
    // stock: {
    //     type: Number,
    //     required:false,
    // },
    rating: {
        type: Number,
        default: 3,
    },
    sales: {
        type: Number,
        default: 0,
    },
    order: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    image: {
        type: String, // URL of the image
        required: false,
    }
});

module.exports = mongoose.model("Product", productSchema);
