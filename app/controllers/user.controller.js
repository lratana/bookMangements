import db from "../models/index.js";

const Op = db.Sequelize.Op;
const User = db.users;

// Create and Save a new User
export const create = (req, res) => {
    // Validate request
    if (!req.body.user_name) {
        res.status(400).send({
            message: "User name can not be empty!",
        });
        return;
    }

    // Create a User
    const user = {
        user_name: req.body.user_name,
    };

    // Save User in the database
    User.create(user)
        .then((data) => {
            // Return the created user with proper timestamps
            res.send(data);
        })
        .catch((err) => {
            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).send({
                    message: "User name already exists. Please choose a different name.",
                });
            } else {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the User.",
                });
            }
        });
};

// Retrieve all Users
export const findAll = (req, res) => {
    // Allow a filter condition via query parameter
    const user_name = req.query.user_name;

    let condition = {};

    if (user_name) {
        condition.user_name = { [Op.like]: `%${user_name}%` };
    }

    // If no conditions, condition will be an empty object which means get all
    const whereClause = Object.keys(condition).length > 0 ? condition : null;

    User.findAll({ where: whereClause })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users.",
            });
        });
};

// Find a single User with an id
export const findOne = (req, res) => {
    const user_id = req.params.id;

    User.findByPk(user_id)
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find User with user_id=${user_id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error retrieving User with user_id=" + user_id,
            });
        });
};

// Update a User by the id in the request
export const update = (req, res) => {
    const user_id = req.params.id;

    User.update(req.body, {
        where: { user_id: user_id }
    })
        .then((result) => {
            const [numAffected] = result;
            if (numAffected == 1) {
                // Fetch the updated user with proper timestamps
                return User.findByPk(user_id);
            } else {
                throw new Error(`Cannot update User with user_id=${user_id}. Maybe User was not found or req.body is empty!`);
            }
        })
        .then((updatedUser) => {
            if (updatedUser) {
                res.send(updatedUser);
            } else {
                res.status(404).send({
                    message: `Cannot find User with user_id=${user_id} after update.`,
                });
            }
        })
        .catch((err) => {
            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).send({
                    message: "User name already exists. Please choose a different name.",
                });
            } else {
                res.status(500).send({
                    message: err.message || "Error updating User with user_id=" + user_id,
                });
            }
        });
};

// Delete a User with the specified id in the request
export const deleteOne = (req, res) => {
    const user_id = req.params.id;

    User.destroy({
        where: { user_id: user_id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete User with user_id=${user_id}. Maybe User was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Could not delete User with user_id=" + user_id,
            });
        });
};

// Delete all Users from the database
export const deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false,
    })
        .then((nums) => {
            res.send({ message: `${nums} Users were deleted successfully!` });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all users.",
            });
        });
};

// Find user by username (exact match)
export const findByUsername = (req, res) => {
    const user_name = req.params.username;

    User.findOne({ where: { user_name: user_name } })
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find User with username=${user_name}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error retrieving User with username=" + user_name,
            });
        });
};