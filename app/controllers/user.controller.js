import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        email: req.body.email || null,
        password: req.body.password || null,
        role: req.body.role || 'user'
    };

    // Hash password if provided
    if (user.password) {
        const saltRounds = 10;
        user.password = bcrypt.hashSync(user.password, saltRounds);
    }

    // Save User in the database
    User.create(user)
        .then((data) => {
            // Remove password from response
            const userResponse = { ...data.toJSON() };
            delete userResponse.password;
            res.send(userResponse);
        })
        .catch((err) => {
            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).send({
                    message: "User name or email already exists. Please choose different credentials.",
                });
            } else {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the User.",
                });
            }
        });
};

// User Login
export const login = (req, res) => {
    console.log('[DEBUG] Login function called with body:', req.body);

    const { user_name, email, password } = req.body;

    // Validate request
    if ((!user_name && !email) || !password) {
        res.status(400).send({
            message: "Username/Email and password are required!",
        });
        return;
    }

    // Find user by username or email
    let whereCondition = {};
    if (user_name) {
        whereCondition.user_name = user_name;
    } else if (email) {
        whereCondition.email = email;
    }

    User.findOne({ where: whereCondition })
        .then((user) => {
            if (!user) {
                return res.status(401).send({
                    message: "Invalid credentials!",
                });
            }

            // Check if user has a password set
            if (!user.password) {
                return res.status(401).send({
                    message: "Account does not have password authentication enabled. Please contact administrator.",
                });
            }

            // Verify password
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).send({
                    message: "Invalid credentials!",
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    user_id: user.user_id,
                    user_name: user.user_name,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET || "your-secret-key",
                { expiresIn: "24h" }
            );

            // Return user info and token (without password)
            res.send({
                message: "Login successful!",
                user: {
                    user_id: user.user_id,
                    user_name: user.user_name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                },
                token: token
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error during login process.",
            });
        });
};

// User Registration
export const register = (req, res) => {
    console.log('[DEBUG] Register function called with body:', req.body);

    // Validate request
    if (!req.body.user_name || !req.body.password) {
        res.status(400).send({
            message: "Username and password are required!",
        });
        return;
    }

    if (req.body.password.length < 6) {
        res.status(400).send({
            message: "Password must be at least 6 characters long!",
        });
        return;
    }

    // Create a User
    const user = {
        user_name: req.body.user_name,
        email: req.body.email || null,
        password: req.body.password,
        role: req.body.role || 'user'
    };

    // Hash password
    const saltRounds = 10;
    user.password = bcrypt.hashSync(user.password, saltRounds);

    // Save User in the database
    User.create(user)
        .then((data) => {
            // Generate JWT token for automatic login after registration
            const token = jwt.sign(
                {
                    user_id: data.user_id,
                    user_name: data.user_name,
                    email: data.email,
                    role: data.role
                },
                process.env.JWT_SECRET || "your-secret-key",
                { expiresIn: "24h" }
            );

            // Return user info and token (without password)
            res.status(201).send({
                message: "User registered successfully!",
                user: {
                    user_id: data.user_id,
                    user_name: data.user_name,
                    email: data.email,
                    role: data.role,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt
                },
                token: token
            });
        })
        .catch((err) => {
            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).send({
                    message: "User name or email already exists. Please choose different credentials.",
                });
            } else {
                res.status(500).send({
                    message: err.message || "Some error occurred while registering the User.",
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

    User.findAll({
        where: whereClause,
        attributes: { exclude: ['password'] } // Exclude password from response
    })
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

    User.findByPk(user_id, {
        attributes: { exclude: ['password'] } // Exclude password from response
    })
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

    User.findOne({
        where: { user_name: user_name },
        attributes: { exclude: ['password'] } // Exclude password from response
    })
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