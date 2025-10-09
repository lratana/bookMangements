export default (sequelize, Sequelize) => {
    const Book = sequelize.define("book", {
        book_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        borrowed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
    }, {
        // Enable automatic timestamp fields (createdAt, updatedAt)
        timestamps: true,
        // Specify table name explicitly
        tableName: 'books'
    });
    return Book;
};