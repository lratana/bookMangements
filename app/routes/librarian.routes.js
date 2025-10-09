import * as librarians from "../controllers/librarian.controller.js";
import express from "express";

export default (app) => {
    let router = express.Router();

    // Create a new Librarian
    router.post("/", librarians.create);

    // Retrieve all Librarians
    router.get("/", librarians.findAll);

    // Find librarians by gender (must come before /:id route)
    router.get("/gender/:gender", librarians.findByGender);

    // Find librarian by phone (must come before /:id route)
    router.get("/phone/:phone", librarians.findByPhone);

    // Retrieve a single Librarian with id
    router.get("/:id", librarians.findOne);

    // Update a Librarian with id
    router.put("/:id", librarians.update);

    // Delete a Librarian with id
    router.delete("/:id", librarians.deleteOne);

    // Delete all Librarians
    router.delete("/", librarians.deleteAll);

    app.use("/api/librarians", router);
};