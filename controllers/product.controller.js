import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({products});
    } catch (error) {
        console.log("Error in get all products controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getFeaturedProducts = async (req,res)=>{
    try {
        
    } catch (error) {
        console.log("Error in get featured products controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
}