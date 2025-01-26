import Product from "../models/product.model.js";

export const getCartProducts = async(req,res)=>{
    try {
        const products = await Product.find({ _id: { $in: req.user.cartItems } });

        // add quantity to each product
        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
			return { ...product.toJSON(), quantity: item.quantity };
        });

        res.json(cartItems);
    } catch (error) {
        console.log("Error in get cart products controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
}


export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
		const user = req.user; // req.user is from the protectRoute middleware because we are using a protected route
        const existingItem = user.cartItems.find((item) => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push(productId);
        }

        await user.save();
		res.json(user.cartItems);
        
    } catch (error) {
        console.log("Error in add to cart controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
};


export const removeAllFromCart = async (req,res) =>{
    try {
        const { productId } = req.body;
		const user = req.user; // req.user is from the protectRoute middleware because we are using a protected route
		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
		}
		await user.save();
		res.json(user.cartItems);
    } catch (error) {
        console.log("Error in remove all from cart controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
};


export const updateQuantity = async (req,res) =>{
    try {
        const {id: productId} = req.params;
        const { quantity } = req.body;
        const user = req.user; // req.user is from the protectRoute middleware because we are using a protected route
        const existingItem = user.cartItems.find((item) => item.id === productId);
        if (existingItem) {
            if(quantity === 0){
                user.cartItems = user.cartItems.filter((item) => item.id !== productId);
                await user.save();
                return res.json(user.cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        } else{
            res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (error) {
        console.log("Error in update quantity controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
}