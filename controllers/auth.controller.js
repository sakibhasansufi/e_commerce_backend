import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import {redis} from '../lib/redis.js';


const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };

};

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevent XSS attacks, cross site scripting attack
        sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // prevent XSS attacks, cross site scripting attack
        sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.status(400).json({ message: "User already exists" });
        };

        if (!name) {
            return res.status(400).json({ message: "Please enter your name" });
        };

        if (!email) {
            return res.status(400).json({ message: "Please enter your email" });
        };

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        };

        if (!password) {
            return res.status(400).json({ message: "Please enter your password" });
        }

        // Check if password contains at least one capital letter
        const capitalLetterRegex = /[A-Z]/;
        if (!capitalLetterRegex.test(password)) {
            return res.status(400).json({ message: "Password must contain at least one capital letter", });
        }

        // Check if password contains at least one number
        const numberRegex = /\d/;
        if (!numberRegex.test(password)) {
            return res.status(400).json({ message: "Password must contain at least one number" });
        }

        const user = await User.create({ name, email, password });

        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);


        setCookies(res, accessToken, refreshToken);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: "User created successfully",
        });

    } catch (error) {
        console.log('Error creating user', error.message);
        res.status(500).json({ message: error.message });
    }

};



export const login = async (req, res) => {

};



export const logOut = async (req, res) => {

};



export const update = async (req, res) => {

}