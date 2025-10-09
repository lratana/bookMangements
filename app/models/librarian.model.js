export default (sequelize, Sequelize) => {
    const Librarian = sequelize.define("librarian", {
        LibrarianID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        LibrarianName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        Gender: {
            type: Sequelize.ENUM('Male', 'Female', 'Other'),
            allowNull: false,
        },
        Phone: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        Address: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
    }, {
        // Enable automatic timestamp fields (createdAt, updatedAt)
        timestamps: true,
        // Specify table name explicitly
        tableName: 'librarians'
    });
    return Librarian;
};