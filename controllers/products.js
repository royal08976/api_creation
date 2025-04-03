const Product = require("../models/product");
const User = require("../models/users");

const getAllProducts = async (req, res) => {
    try {
        const { categoryUid, title, sort, select } = req.query;
        const queryObject = {};

        if (categoryUid) {
            queryObject.categoryUid = categoryUid;
        }

        if (title) {
            queryObject.title = { $regex: title, $options: "i" }; // Case-insensitive search
        }

        let apiData = Product.find(queryObject);

        if (sort) {
            let sortFix = sort.split(",").join(" ");
            apiData = apiData.sort(sortFix);
        }

        if (select) {
            let selectFix = select.split(",").join(" ");
            apiData = apiData.select(selectFix);
        }

        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;
        let skip = (page - 1) * limit;
        apiData = apiData.skip(skip).limit(limit);

        const products = await apiData;
        res.status(200).json({ products, nbHits: products.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const postAllProducts = async (req, res) => {
    try {
        const { uid, title, description, categoryUid, brand, price, stock, image } = req.body;
        if (!uid || !title || !description || !categoryUid || !brand || !price || !stock) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }
        
        const product = new Product({
            uid,
            title,
            description,
            categoryUid,
            brand,
            price,
            stock,
            image,
        });
        await product.save();
        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllProductsTesting = async (req, res) => {
    try {
        const products = await Product.find(req.query).select("title");
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllProducts, getAllProductsTesting, postAllProducts };