import * as users from "../controllers/user.controller.js";
import express from "express";

export default (app) => {
    let router = express.Router();

    // Create a new User
    router.post("/", users.create);

    // Retrieve all Users
    router.get("/", users.findAll);

    // Find user by username (must come before /:id route)
    router.get("/username/:username", users.findByUsername);

    // Retrieve a single User with id
    router.get("/:id", users.findOne);

    // Update a User with id
    router.put("/:id", users.update);

    // Delete a User with id
    router.delete("/:id", users.deleteOne);

    // Delete all Users
    router.delete("/", users.deleteAll);

    app.use("/api/users", router);
};