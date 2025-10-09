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
    }, {
        // Enable automatic timestamp fields (createdAt, updatedAt)
        timestamps: true,
        // Specify table name explicitly
        tableName: 'users'
    });
    return User;
};