import express from 'express';
import {getProfile, login, logout, refreshToken, register, update} from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);
router.post("/update",update);
router.post("/refresh-token",refreshToken);
router.post("/profile",getProfile);

export default router;