export default (sequelize, Sequelize) => {
    const Borrow = sequelize.define("borrow", {
        BorrowID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        UserID: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        LibrarianID: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'librarians',
                key: 'LibrarianID'
            }
        },
        BookId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'books',
                key: 'book_id'
            }
        },
        BorrowBookDate: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        ReturnBookDate: {
            type: Sequelize.DATEONLY,
            allowNull: true,
        },
        IsBorrow: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'true = currently borrowed, false = returned'
        },
    }, {
        // Enable automatic timestamp fields (createdAt, updatedAt)
        timestamps: true,
        // Specify table name explicitly
        tableName: 'borrows'
    });
    return Borrow;
};