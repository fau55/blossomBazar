import { getAllUsers, registerAsBuyer, registerAsSeller, login, getuserById, uploadUserProfile, editUser, getUserProfile, delteUserById } from '../controllers/user.controller.js'
import { Router } from "express";
const router = Router();

router.route('/get-all').get(getAllUsers);
// API to get all users
// app.get("/api/bb/user/get/all", (req, res) =>);

// API to register as seller
// app.post("/api/bb/user/register/seller", (req, res) =>);

// API to register as buyer
// app.post("/api/bb/user/register/buyer", (req, res) =>);

// Endpoint to get user by id
// app.get("/api/user/get/id/:id", (req, res) => );

// API for login
// app.post("/api/user/login", (req, res) => );

// Upload profile pic
// app.post("/api/bb/upload/profilePic/:id", (req, res) => );

// Get profile photo
// app.get("/api/bb/get/profilePic/:id", (req, res) =>);

// Edit user info
// app.post("/api/bb/edit/user/:id", (req, res) => );

// Delete user
// app.delete("/api/bb/delete/user/:id", (req, res) =>);

export default router;