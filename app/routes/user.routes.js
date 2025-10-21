import * as users from "../controllers/user.controller.js";
import express from "express";

export default (app) => {
    console.log('=================================================');
    console.log('[DEBUG] USER ROUTES FUNCTION CALLED!');
    console.log('[DEBUG] Loading user routes...');
    console.log('[DEBUG] Available user functions:', Object.keys(users));
    console.log('=================================================');

    let router = express.Router();

    // Authentication routes (specific routes first)
    console.log('[DEBUG] Setting up login route...');
    router.post("/login", users.login);
    console.log('[DEBUG] Setting up register route...');
    router.post("/register", users.register);

    // Test route with completely unique path
    router.get("/hello-world", (req, res) => {
        console.log('[DEBUG] Hello world route hit!');
        res.json({ message: "Hello from user routes!" });
    });

    // Test route
    router.get("/test", (req, res) => {
        console.log('[DEBUG] Test route hit!');
        res.json({ message: "User routes are working!" });
    });

    // Create a new User
    router.post("/", users.create);

    // Retrieve all Users
    router.get("/", users.findAll);

    // Find user by username (must come before /:id route)
    router.get("/username/:username", users.findByUsername);

    // Retrieve a single User with id (must be last among GET routes)
    router.get("/:id", users.findOne);

    // Update a User with id
    router.put("/:id", users.update);

    // Delete a User with id
    router.delete("/:id", users.deleteOne);

    // Delete all Users
    router.delete("/", users.deleteAll);

    app.use("/api/users", router);
    console.log('[DEBUG] User routes registered at /api/users');
};