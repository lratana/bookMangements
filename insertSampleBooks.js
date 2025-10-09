import db from "./app/models/index.js";

const Book = db.books;

// Sample book data
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

// Function to insert sample data
const insertSampleBooks = async () => {
    try {
        // Sync database first
        await db.sequelize.sync();
        console.log("Database synced successfully.");

        // Check if books already exist
        const existingBooks = await Book.findAll();
        if (existingBooks.length > 0) {
            console.log(`Found ${existingBooks.length} existing books. Skipping insertion.`);
            console.log("Existing books:");
            existingBooks.forEach(book => {
                console.log(`- ${book.title} by ${book.author} (ID: ${book.book_id})`);
            });
            return;
        }

        // Insert sample books
        console.log("Inserting sample books...");
        const createdBooks = await Book.bulkCreate(sampleBooks);

        console.log(`Successfully inserted ${createdBooks.length} books:`);
        createdBooks.forEach(book => {
            const status = book.borrowed ? `(Borrowed by user ${book.user_id})` : "(Available)";
            console.log(`- ${book.title} by ${book.author} ${status}`);
        });

    } catch (error) {
        console.error("Error inserting sample books:", error);
    } finally {
        // Close database connection
        await db.sequelize.close();
        console.log("Database connection closed.");
    }
};

// Run the insertion
insertSampleBooks();