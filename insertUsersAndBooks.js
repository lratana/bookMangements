import db from "./app/models/index.js";

const User = db.users;

// Sample user data
const sampleUsers = [
    { user_name: "john_doe" },
    { user_name: "jane_smith" },
    { user_name: "mike_johnson" },
    { user_name: "sarah_williams" },
    { user_name: "david_brown" },
    { user_name: "emily_davis" },
    { user_name: "chris_wilson" },
    { user_name: "lisa_anderson" },
    { user_name: "kevin_taylor" },
    { user_name: "anna_martin" }
];

// Function to recreate tables and insert sample data
const recreateAndInsertUsers = async () => {
    try {
        console.log("Forcing database sync to recreate tables...");

        // Force sync - this will drop and recreate tables
        await db.sequelize.sync({ force: true });
        console.log("Database synced successfully with force=true.");

        // Insert sample users first
        console.log("Inserting sample users...");
        const createdUsers = await User.bulkCreate(sampleUsers);

        console.log(`\nSuccessfully inserted ${createdUsers.length} users:`);
        createdUsers.forEach(user => {
            console.log(`- ID: ${user.user_id} | Username: ${user.user_name}`);
        });

        // Now insert sample books with proper user references
        const Book = db.books;
        const sampleBooks = [
            {
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                borrowed: false,
                user_id: null
            },
            {
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                borrowed: false,
                user_id: null
            },
            {
                title: "1984",
                author: "George Orwell",
                borrowed: true,
                user_id: 1
            },
            {
                title: "Pride and Prejudice",
                author: "Jane Austen",
                borrowed: false,
                user_id: null
            },
            {
                title: "The Catcher in the Rye",
                author: "J.D. Salinger",
                borrowed: false,
                user_id: null
            },
            {
                title: "Harry Potter and the Philosopher's Stone",
                author: "J.K. Rowling",
                borrowed: true,
                user_id: 2
            },
            {
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                borrowed: false,
                user_id: null
            },
            {
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                borrowed: false,
                user_id: null
            },
            {
                title: "Fahrenheit 451",
                author: "Ray Bradbury",
                borrowed: true,
                user_id: 3
            },
            {
                title: "The Chronicles of Narnia",
                author: "C.S. Lewis",
                borrowed: false,
                user_id: null
            }
        ];

        // Insert sample books
        console.log("\nInserting sample books...");
        const createdBooks = await Book.bulkCreate(sampleBooks);

        console.log(`\nSuccessfully inserted ${createdBooks.length} books:`);
        createdBooks.forEach(book => {
            const status = book.borrowed ? `(Borrowed by user ${book.user_id})` : "(Available)";
            console.log(`- ID: ${book.book_id} | ${book.title} by ${book.author} ${status}`);
        });

        console.log("\n📊 Summary:");
        const availableBooks = createdBooks.filter(book => !book.borrowed);
        const borrowedBooks = createdBooks.filter(book => book.borrowed);
        console.log(`Users: ${createdUsers.length}`);
        console.log(`Total Books: ${createdBooks.length}`);
        console.log(`Available Books: ${availableBooks.length}`);
        console.log(`Borrowed Books: ${borrowedBooks.length}`);

    } catch (error) {
        console.error("Error recreating and inserting data:", error);
    } finally {
        // Close database connection
        await db.sequelize.close();
        console.log("\nDatabase connection closed.");
    }
};

// Run the recreation and insertion
recreateAndInsertUsers();