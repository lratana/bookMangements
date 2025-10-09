import db from "../models/index.js";

const Op = db.Sequelize.Op;
const Borrow = db.borrows;
const Book = db.books;
const User = db.users;
const Librarian = db.librarians;

// Create a new Borrow record (Borrow a book)
export const borrowBook = (req, res) => {
    // Validate request
    if (!req.body.UserID) {
        res.status(400).send({
            message: "User ID can not be empty!",
        });
        return;
    }

    if (!req.body.LibrarianID) {
        res.status(400).send({
            message: "Librarian ID can not be empty!",
        });
        return;
    }

    if (!req.body.BookId) {
        res.status(400).send({
            message: "Book ID can not be empty!",
        });
        return;
    }

    // First check if the book exists and is available
    Book.findByPk(req.body.BookId)
        .then((book) => {
            if (!book) {
                res.status(404).send({
                    message: "Book not found!",
                });
                return;
            }

            if (book.borrowed) {
                res.status(400).send({
                    message: "Book is already borrowed!",
                });
                return;
            }

            // Check if user exists
            return User.findByPk(req.body.UserID);
        })
        .then((user) => {
            if (!user) {
                res.status(404).send({
                    message: "User not found!",
                });
                return;
            }

            // Check if librarian exists
            return Librarian.findByPk(req.body.LibrarianID);
        })
        .then((librarian) => {
            if (!librarian) {
                res.status(404).send({
                    message: "Librarian not found!",
                });
                return;
            }

            // Create the borrow record
            const borrow = {
                UserID: req.body.UserID,
                LibrarianID: req.body.LibrarianID,
                BookId: req.body.BookId,
                BorrowBookDate: req.body.BorrowBookDate || new Date().toISOString().split('T')[0],
                IsBorrow: true,
            };

            return Borrow.create(borrow);
        })
        .then((borrowData) => {
            // Update the book status to borrowed
            return Book.update(
                {
                    borrowed: true,
                    user_id: req.body.UserID
                },
                { where: { book_id: req.body.BookId } }
            ).then(() => {
                // For now, just return the basic borrow data to avoid association issues
                console.log('[DEBUG] Returning basic borrow data:', borrowData.toJSON());
                res.send(borrowData);
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while borrowing the book.",
            });
        });
};

// Return a book (Update borrow record)
export const returnBook = (req, res) => {
    const borrowId = req.params.id;
    const returnDate = req.body.ReturnBookDate || new Date().toISOString().split('T')[0];

    // Find the borrow record
    Borrow.findByPk(borrowId)
        .then((borrow) => {
            if (!borrow) {
                res.status(404).send({
                    message: `Cannot find Borrow record with BorrowID=${borrowId}.`,
                });
                return;
            }

            if (!borrow.IsBorrow) {
                res.status(400).send({
                    message: "Book has already been returned!",
                });
                return;
            }

            // Update the borrow record
            return Borrow.update(
                {
                    ReturnBookDate: returnDate,
                    IsBorrow: false
                },
                { where: { BorrowID: borrowId } }
            ).then(() => borrow);
        })
        .then((borrow) => {
            // Update the book status to available
            return Book.update(
                {
                    borrowed: false,
                    user_id: null
                },
                { where: { book_id: borrow.BookId } }
            ).then(() => {
                // Return the updated borrow record with full details
                return Borrow.findByPk(borrowId, {
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['user_id', 'user_name', 'createdAt', 'updatedAt']
                        },
                        {
                            model: Librarian,
                            as: 'librarian',
                            attributes: ['LibrarianID', 'LibrarianName', 'createdAt', 'updatedAt']
                        },
                        {
                            model: Book,
                            as: 'book',
                            attributes: ['book_id', 'title', 'author', 'borrowed', 'createdAt', 'updatedAt']
                        }
                    ]
                });
            });
        })
        .then((updatedBorrow) => {
            res.send(updatedBorrow);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error returning book with BorrowID=" + borrowId,
            });
        });
};

// Retrieve all Borrow records
export const findAll = (req, res) => {
    // Allow filtering by various parameters
    const userId = req.query.userId;
    const librarianId = req.query.librarianId;
    const bookId = req.query.bookId;
    const isBorrow = req.query.isBorrow;

    let condition = {};

    if (userId) {
        condition.UserID = userId;
    }

    if (librarianId) {
        condition.LibrarianID = librarianId;
    }

    if (bookId) {
        condition.BookId = bookId;
    }

    if (isBorrow !== undefined) {
        condition.IsBorrow = isBorrow === 'true';
    }

    const whereClause = Object.keys(condition).length > 0 ? condition : null;

    // Manual data joining to get the exact format requested
    Borrow.findAll({ where: whereClause })
        .then(async (borrowData) => {
            // Get all unique IDs
            const userIds = [...new Set(borrowData.map(b => b.UserID))];
            const librarianIds = [...new Set(borrowData.map(b => b.LibrarianID))];
            const bookIds = [...new Set(borrowData.map(b => b.BookId))];

            // Fetch related data
            const [users, librarians, books] = await Promise.all([
                User.findAll({ where: { user_id: userIds } }),
                Librarian.findAll({ where: { LibrarianID: librarianIds } }),
                Book.findAll({ where: { book_id: bookIds } })
            ]);

            // Create lookup maps
            const userMap = users.reduce((map, user) => {
                map[user.user_id] = user;
                return map;
            }, {});

            const librarianMap = librarians.reduce((map, librarian) => {
                map[librarian.LibrarianID] = librarian;
                return map;
            }, {});

            const bookMap = books.reduce((map, book) => {
                map[book.book_id] = book;
                return map;
            }, {});

            // Format data according to requested JSON structure
            const formattedData = borrowData.map(borrow => ({
                BorrowID: borrow.BorrowID,
                BorrowBookDate: borrow.BorrowBookDate,
                ReturnBookDate: borrow.ReturnBookDate,
                IsBorrow: borrow.IsBorrow,
                Users: userMap[borrow.UserID] ? {
                    user_id: userMap[borrow.UserID].user_id,
                    user_name: userMap[borrow.UserID].user_name,
                    createdAt: userMap[borrow.UserID].createdAt,
                    updatedAt: userMap[borrow.UserID].updatedAt
                } : null,
                librarians: librarianMap[borrow.LibrarianID] ? {
                    LibrarianID: librarianMap[borrow.LibrarianID].LibrarianID,
                    LibrarianName: librarianMap[borrow.LibrarianID].LibrarianName,
                    Gender: librarianMap[borrow.LibrarianID].Gender,
                    Phone: librarianMap[borrow.LibrarianID].Phone,
                    Address: librarianMap[borrow.LibrarianID].Address,
                    createdAt: librarianMap[borrow.LibrarianID].createdAt,
                    updatedAt: librarianMap[borrow.LibrarianID].updatedAt
                } : null,
                books: bookMap[borrow.BookId] ? {
                    book_id: bookMap[borrow.BookId].book_id,
                    title: bookMap[borrow.BookId].title,
                    author: bookMap[borrow.BookId].author,
                    borrowed: bookMap[borrow.BookId].borrowed,
                    user_id: bookMap[borrow.BookId].user_id,
                    createdAt: bookMap[borrow.BookId].createdAt,
                    updatedAt: bookMap[borrow.BookId].updatedAt
                } : null,
                createdAt: borrow.createdAt,
                updatedAt: borrow.updatedAt
            }));

            res.send(formattedData);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving borrow records.",
            });
        });
};

// Find a single Borrow record with an id
export const findOne = (req, res) => {
    const borrowId = req.params.id;

    Borrow.findByPk(borrowId, {
        include: [
            {
                model: User,
                as: 'Users',  // Capitalized to match your JSON format
                attributes: ['user_id', 'user_name', 'createdAt', 'updatedAt']
            },
            {
                model: Librarian,
                as: 'librarians',  // lowercase to match your JSON format
                attributes: ['LibrarianID', 'LibrarianName', 'Gender', 'Phone', 'Address', 'createdAt', 'updatedAt']
            },
            {
                model: Book,
                as: 'books',  // lowercase to match your JSON format
                attributes: ['book_id', 'title', 'author', 'borrowed', 'user_id', 'createdAt', 'updatedAt']
            }
        ]
    })
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Borrow record with BorrowID=${borrowId}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error retrieving Borrow record with BorrowID=" + borrowId,
            });
        });
};

// Get all currently borrowed books
export const getCurrentlyBorrowed = (req, res) => {
    Borrow.findAll({ where: { IsBorrow: true } })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving currently borrowed books.",
            });
        });
};

// Get all returned books
export const getReturnedBooks = (req, res) => {
    Borrow.findAll({ where: { IsBorrow: false } })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving returned books.",
            });
        });
};

// Get borrow history for a specific user
export const getUserBorrowHistory = (req, res) => {
    const userId = req.params.userId;

    Borrow.findAll({ where: { UserID: userId } })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving user borrow history.",
            });
        });
};

// Get borrow records handled by a specific librarian
export const getLibrarianBorrowRecords = (req, res) => {
    const librarianId = req.params.librarianId;

    Borrow.findAll({ where: { LibrarianID: librarianId } })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving librarian borrow records.",
            });
        });
};

// Get borrow history for a specific book
export const getBookBorrowHistory = (req, res) => {
    const bookId = req.params.bookId;

    Borrow.findAll({ where: { BookId: bookId } })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving book borrow history.",
            });
        });
};

// Delete a Borrow record (Admin function)
export const deleteOne = (req, res) => {
    const borrowId = req.params.id;

    Borrow.destroy({
        where: { BorrowID: borrowId },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Borrow record was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Borrow record with BorrowID=${borrowId}. Maybe record was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Could not delete Borrow record with BorrowID=" + borrowId,
            });
        });
};

// Get statistics
export const getStatistics = (req, res) => {
    Promise.all([
        Borrow.count({ where: { IsBorrow: true } }),
        Borrow.count({ where: { IsBorrow: false } }),
        Borrow.count(),
        Book.count({ where: { borrowed: true } }),
        Book.count({ where: { borrowed: false } })
    ])
        .then(([currentlyBorrowed, returned, totalBorrows, borrowedBooks, availableBooks]) => {
            res.send({
                currentlyBorrowedRecords: currentlyBorrowed,
                returnedRecords: returned,
                totalBorrowRecords: totalBorrows,
                currentlyBorrowedBooks: borrowedBooks,
                availableBooks: availableBooks,
                totalBooks: borrowedBooks + availableBooks
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error retrieving statistics.",
            });
        });
};