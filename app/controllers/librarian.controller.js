import db from "../models/index.js";

const Op = db.Sequelize.Op;
const Librarian = db.librarians;

// Create and Save a new Librarian
export const create = (req, res) => {
    // Validate request
    if (!req.body.LibrarianName) {
        res.status(400).send({
            message: "Librarian name can not be empty!",
        });
        return;
    }

    if (!req.body.Gender) {
        res.status(400).send({
            message: "Gender can not be empty!",
        });
        return;
    }

    if (!req.body.Phone) {
        res.status(400).send({
            message: "Phone number can not be empty!",
        });
        return;
    }

    if (!req.body.Address) {
        res.status(400).send({
            message: "Address can not be empty!",
        });
        return;
    }

    // Create a Librarian
    const librarian = {
        LibrarianName: req.body.LibrarianName,
        Gender: req.body.Gender,
        Phone: req.body.Phone,
        Address: req.body.Address,
    };

    // Save Librarian in the database
    Librarian.create(librarian)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).send({
                    message: "Phone number already exists. Please use a different phone number.",
                });
            } else if (err.name === 'SequelizeValidationError') {
                res.status(400).send({
                    message: "Invalid gender. Please use 'Male', 'Female', or 'Other'.",
                });
            } else {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Librarian.",
                });
            }
        });
};

// Retrieve all Librarians
export const findAll = (req, res) => {
    // Allow a filter condition via query parameter
    const name = req.query.name;
    const gender = req.query.gender;
    const phone = req.query.phone;

    let condition = {};

    if (name) {
        condition.LibrarianName = { [Op.like]: `%${name}%` };
    }

    if (gender) {
        condition.Gender = gender;
    }

    if (phone) {
        condition.Phone = { [Op.like]: `%${phone}%` };
    }

    // If no conditions, condition will be an empty object which means get all
    const whereClause = Object.keys(condition).length > 0 ? condition : null;

    Librarian.findAll({ where: whereClause })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving librarians.",
            });
        });
};

// Find a single Librarian with an id
export const findOne = (req, res) => {
    const LibrarianID = req.params.id;

    Librarian.findByPk(LibrarianID)
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Librarian with LibrarianID=${LibrarianID}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error retrieving Librarian with LibrarianID=" + LibrarianID,
            });
        });
};

// Update a Librarian by the id in the request
export const update = (req, res) => {
    const LibrarianID = req.params.id;

    Librarian.update(req.body, {
        where: { LibrarianID: LibrarianID }
    })
        .then((result) => {
            const [numAffected] = result;
            if (numAffected == 1) {
                // Fetch the updated librarian with proper timestamps
                return Librarian.findByPk(LibrarianID);
            } else {
                throw new Error(`Cannot update Librarian with LibrarianID=${LibrarianID}. Maybe Librarian was not found or req.body is empty!`);
            }
        })
        .then((updatedLibrarian) => {
            if (updatedLibrarian) {
                res.send(updatedLibrarian);
            } else {
                res.status(404).send({
                    message: `Cannot find Librarian with LibrarianID=${LibrarianID} after update.`,
                });
            }
        })
        .catch((err) => {
            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).send({
                    message: "Phone number already exists. Please use a different phone number.",
                });
            } else if (err.name === 'SequelizeValidationError') {
                res.status(400).send({
                    message: "Invalid gender. Please use 'Male', 'Female', or 'Other'.",
                });
            } else {
                res.status(500).send({
                    message: err.message || "Error updating Librarian with LibrarianID=" + LibrarianID,
                });
            }
        });
};

// Delete a Librarian with the specified id in the request
export const deleteOne = (req, res) => {
    const LibrarianID = req.params.id;

    Librarian.destroy({
        where: { LibrarianID: LibrarianID },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Librarian was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Librarian with LibrarianID=${LibrarianID}. Maybe Librarian was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Could not delete Librarian with LibrarianID=" + LibrarianID,
            });
        });
};

// Delete all Librarians from the database
export const deleteAll = (req, res) => {
    Librarian.destroy({
        where: {},
        truncate: false,
    })
        .then((nums) => {
            res.send({ message: `${nums} Librarians were deleted successfully!` });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all librarians.",
            });
        });
};

// Find librarians by gender
export const findByGender = (req, res) => {
    const gender = req.params.gender;

    Librarian.findAll({ where: { Gender: gender } })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving librarians by gender.",
            });
        });
};

// Find librarian by phone number (exact match)
export const findByPhone = (req, res) => {
    const phone = req.params.phone;

    Librarian.findOne({ where: { Phone: phone } })
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Librarian with phone=${phone}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error retrieving Librarian with phone=" + phone,
            });
        });
};