import * as borrows from "../controllers/borrow.controller.js";
import express from "express";

export default (app) => {
    let router = express.Router();

    // Borrow a book
    router.post("/borrow", borrows.borrowBook);

    // Return a book
    router.put("/return/:id", borrows.returnBook);

    // Update a borrow record
    router.put("/:id", borrows.updateBorrow);

    // Get all borrow records
    router.get("/", borrows.findAll);

    // Get statistics
    router.get("/statistics", borrows.getStatistics);

    // Get currently borrowed books (must come before /:id route)
    router.get("/currently-borrowed", borrows.getCurrentlyBorrowed);

    // Get returned books (must come before /:id route)
    router.get("/returned", borrows.getReturnedBooks);

    // Get user borrow history (must come before /:id route)
    router.get("/user/:userId", borrows.getUserBorrowHistory);

    // Get librarian borrow records (must come before /:id route)
    router.get("/librarian/:librarianId", borrows.getLibrarianBorrowRecords);

    // Get book borrow history (must come before /:id route)
    router.get("/book/:bookId", borrows.getBookBorrowHistory);

    // Get a specific borrow record
    router.get("/:id", borrows.findOne);

    // Delete a borrow record (Admin function)
    router.delete("/:id", borrows.deleteOne);

    app.use("/api/borrows", router);
};