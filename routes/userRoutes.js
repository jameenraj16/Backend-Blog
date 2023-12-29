import { getAllUser, login, signup, updateUser } from "../controller/userController.js";
import express from "express";

const router = express.Router();

router.get("/", getAllUser);
router.post("/signup", signup);
router.post("/login", login);
router.put("/update/:id", updateUser);

export default router;
