import * as books from "../controllers/book.controller.js";
import express from "express";

export default (app) => {
    let router = express.Router();

    // Create a new Book
    router.post("/", books.create);

    // Retrieve all Books
    router.get("/", books.findAll);

    // Find all available Books (must come before /:id route)
    router.get("/available", books.findAllAvailable);

    // Retrieve a single Book with id
    router.get("/:id", books.findOne);

    // Update a Book with id
    router.put("/:id", books.update);

    // Delete a Book with id
    router.delete("/:id", books.deleteOne);

    // Delete all Books
    router.delete("/", books.deleteAll);

    app.use("/api/books", router);
};