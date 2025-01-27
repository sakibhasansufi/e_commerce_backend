import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createCheckOutSession } from "../controllers/payment.controller.js";

const router = express.Router();

router.post('/create-payment-checkout',protectRoute,createCheckOutSession);


export default router;