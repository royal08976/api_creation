require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/product");
const Category = require("./models/category");
const ProductJson = require("./products.json");
const CategoryJson = require("./categories.json");

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);

        // Insert categories if they don't exist
        for (const category of CategoryJson) {
            await Category.findOneAndUpdate(
                { uid: category.uid },
                category,
                { upsert: true, new: true }
            );
        }

        // Fetch all categories to create a mapping
        const categories = await Category.find({});
        const categoryMap = categories.reduce((acc, category) => {
            acc[category.uid] = category.uid;
            return acc;
        }, {});

        // Insert or update products
        for (const product of ProductJson) {
            if (!categoryMap[product.categoryUid]) {
                console.warn(`⚠️ Warning: Product "${product.title}" has an undefined category: "${product.categoryUid}"`);
                continue; // Skip inserting if categoryUid is not found
            }

            await Product.findOneAndUpdate(
                { uid: product.uid },
                {
                    title: product.title,
                    description: product.description,
                    categoryUid: categoryMap[product.categoryUid], // Ensures category UID is valid
                    brand: product.brand,
                    price: product.price,
                    stock: product.stock,
                    rating: product.rating,
                    sales: product.sales,
                    order: product.order,
                    image: product.image
                },
                { upsert: true, new: true }
            );
        }

        console.log("✅ Database updated successfully (Old data kept, new added)!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error while updating database:", error);
        process.exit(1);
    }
};

start();
