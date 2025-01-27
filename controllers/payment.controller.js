export const createCheckOutSession = async(req,res) =>{
    try {
        const {products,couponCode} = req.body;
    } catch (error) {
        console.log("Error in createCheckOutSession",error.message);
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
}