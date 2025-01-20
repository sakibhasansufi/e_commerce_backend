import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ products });
    } catch (error) {
        console.log("Error in get all products controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            console.log("From Redis");
            return res.json(JSON.parse(featuredProducts));
        }
        // if not redis fetch from mongodb
        featuredProducts = await Product.find({ isFeatured: true }).lean();
        if (!featuredProducts) {
            return res.status(404).json({ message: "Featured products not found" });
        }
        await redis.set("featured_products", JSON.stringify(featuredProducts));
        res.json(featuredProducts);
    } catch (error) {
        console.log("Error in get featured products controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });

    }
};


export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }
        const product = new Product({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        });
        res.status(201).json(product);
    } catch (error) {
        console.log("Error in create product controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted from cloudinary");
            } catch (error) {
                console.log("Error in cloudinary delete", error.message);

            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Error in delete product controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });

    }
};



export const getRecommendations = async (req, res) => {
    try {
        const products = await Product.aggregate([
            { $sample: { size: 5 } },
            { $project: { _id: 1, name: 1, description: 1, price: 1, image: 1 } },
        ]);
        res.json(products);
    } catch (error) {
        console.log("Error in get recommendations controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



export const getProductByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category });
        res.json(products);
    } catch (error) {
        console.log("Error in get product by category controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log("Error in toggle featured product controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


async function updateFeaturedProductsCache() {
    try {
        // lean() method is used to get plain javascript objects instead of mongoose documents
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("Error in update featured products cache", error.message);
    }
}