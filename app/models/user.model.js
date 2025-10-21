export default (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: true, // Making it nullable for backward compatibility
        },
        role: {
            type: Sequelize.ENUM('user', 'admin'),
            defaultValue: 'user',
            allowNull: false
        }
    }, {
        // Enable automatic timestamp fields (createdAt, updatedAt)
        timestamps: true,
        // Specify table name explicitly
        tableName: 'users'
    });
    return User;
};