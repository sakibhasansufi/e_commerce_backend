import express from 'express';
import {login, logOut, register, update} from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",logOut);
router.post("/update",update);

export default router;