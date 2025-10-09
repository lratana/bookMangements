import dbConfig from "../config/db.config.js";
import Sequelize from "sequelize";
import Tutorial from "./tutorial.model.js";
import Book from "./book.model.js";
import User from "./user.model.js";
import Librarian from "./librarian.model.js";
import Borrow from "./borrow.model.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    port: dbConfig.PORT,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.tutorials = Tutorial(sequelize, Sequelize);
db.books = Book(sequelize, Sequelize);
db.users = User(sequelize, Sequelize);
db.librarians = Librarian(sequelize, Sequelize);
db.borrows = Borrow(sequelize, Sequelize);

// Define associations
db.books.belongsTo(db.users, {
    foreignKey: 'user_id',
    as: 'user'
});

db.users.hasMany(db.books, {
    foreignKey: 'user_id',
    as: 'books'
});

export default db;