import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
const router=Router()
import { Register,login,logout } from "../controllers/customer.controller.js";
router.route('/register').post(Register)
router.route("/login").post(login)
router.route("/logout").post(verifyJwt,logout)
export default router