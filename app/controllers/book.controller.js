import db from "../models/index.js";

const Op = db.Sequelize.Op;
const Book = db.books;
const User = db.users;

// Create and Save a new Book
export const create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Title can not be empty!",
        });
        return;
    }

    if (!req.body.author) {
        res.status(400).send({
            message: "Author can not be empty!",
        });
        return;
    }

    // Create a Book
    const book = {
        title: req.body.title,
        author: req.body.author,
        borrowed: req.body.borrowed !== undefined ? req.body.borrowed : false,
        user_id: req.body.user_id || null,
    };

    // Save Book in the database
    Book.create(book)
        .then((data) => {
            // Return the created book with user information
            return Book.findByPk(data.book_id, {
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'user_name', 'createdAt', 'updatedAt'],
                    required: false
                }]
            });
        })
        .then((completeData) => {
            res.send(completeData);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Book.",
            });
        });
};

// Retrieve all Books
export const findAll = (req, res) => {
    // Allow a filter condition via query parameter
    const title = req.query.title;
    const author = req.query.author;
    const borrowed = req.query.borrowed;

    let condition = {};

    if (title) {
        condition.title = { [Op.like]: `%${title}%` };
    }

    if (author) {
        condition.author = { [Op.like]: `%${author}%` };
    }

    if (borrowed !== undefined) {
        condition.borrowed = borrowed === 'true';
    }

    // If no conditions, condition will be an empty object which means get all
    const whereClause = Object.keys(condition).length > 0 ? condition : null;

    Book.findAll({
        where: whereClause,
        include: [{
            model: User,
            as: 'user', // alias for the association
            attributes: ['user_id', 'user_name', 'createdAt', 'updatedAt'],
            required: false // LEFT JOIN (includes books without users)
        }]
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving books.",
            });
        });
};

// Find a single Book with an id
export const findOne = (req, res) => {
    const book_id = req.params.id;

    Book.findByPk(book_id, {
        include: [{
            model: User,
            as: 'user', // alias for the association
            attributes: ['user_id', 'user_name', 'createdAt', 'updatedAt'],
            required: false // LEFT JOIN (includes books without users)
        }]
    })
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Book with book_id=${book_id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error retrieving Book with book_id=" + book_id,
            });
        });
};

// Update a Book by the id in the request
export const update = (req, res) => {
    const book_id = req.params.id;
    console.log(`[BOOK CONTROLLER] Update called for book_id: ${book_id}`);
    console.log(`[BOOK CONTROLLER] Request body:`, req.body);

    Book.update(req.body, {
        where: { book_id: book_id }
    })
        .then((result) => {
            const [numAffected] = result;
            if (numAffected == 1) {
                // Fetch the updated book with user information
                return Book.findByPk(book_id, {
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['user_id', 'user_name', 'createdAt', 'updatedAt'],
                        required: false
                    }]
                });
            } else {
                throw new Error(`Cannot update Book with book_id=${book_id}. Maybe Book was not found or req.body is empty!`);
            }
        })
        .then((updatedBook) => {
            if (updatedBook) {
                res.send(updatedBook);
            } else {
                res.status(404).send({
                    message: `Cannot find Book with book_id=${book_id} after update.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error updating Book with book_id=" + book_id,
            });
        });
};

// Delete a Book with the specified id in the request
export const deleteOne = (req, res) => {
    const book_id = req.params.id;

    Book.destroy({
        where: { book_id: book_id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Book was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Book with book_id=${book_id}. Maybe Book was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Could not delete Book with book_id=" + book_id,
            });
        });
};

// Delete all Books from the database
export const deleteAll = (req, res) => {
    Book.destroy({
        where: {},
        truncate: false,
    })
        .then((nums) => {
            res.send({ message: `${nums} Books were deleted successfully!` });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all books.",
            });
        });
};

// Find all available Books (not borrowed)
export const findAllAvailable = (req, res) => {
    Book.findAll({ where: { borrowed: false } })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving available books.",
            });
        });
};