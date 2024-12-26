import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true]
    },
    email : {
        type: String,
        required: [true],
        unique: true,
        lowercase: true,
        trim: true
    },
    password : {
        type: String,
        required: [true],
    },
    cartItems : [
        {
            quantity: {
                type: Number,
                default: 1
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        }
    ],
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    }
}, {timestamps: true});


userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        next();
    };

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});


userSchema.methods.comparePasswords = async function(password) {
    return await bcrypt.compare(password, this.password);
};


const User = mongoose.model("User", userSchema);
export default User;