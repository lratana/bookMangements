import db from "./app/models/index.js";

const Librarian = db.librarians;

// Sample librarian data
const sampleLibrarians = [
    {
        LibrarianName: "Alice Johnson",
        Gender: "Female",
        Phone: "+1-555-0001",
        Address: "123 Main Street, City Center, State 12345"
    },
    {
        LibrarianName: "Bob Smith",
        Gender: "Male",
        Phone: "+1-555-0002",
        Address: "456 Oak Avenue, Downtown, State 12346"
    },
    {
        LibrarianName: "Catherine Lee",
        Gender: "Female",
        Phone: "+1-555-0003",
        Address: "789 Pine Road, Suburb, State 12347"
    },
    {
        LibrarianName: "David Brown",
        Gender: "Male",
        Phone: "+1-555-0004",
        Address: "321 Elm Street, Uptown, State 12348"
    },
    {
        LibrarianName: "Emma Wilson",
        Gender: "Female",
        Phone: "+1-555-0005",
        Address: "654 Maple Lane, Riverside, State 12349"
    },
    {
        LibrarianName: "Frank Davis",
        Gender: "Male",
        Phone: "+1-555-0006",
        Address: "987 Cedar Boulevard, Hillside, State 12350"
    },
    {
        LibrarianName: "Grace Chen",
        Gender: "Female",
        Phone: "+1-555-0007",
        Address: "147 Birch Court, Valley View, State 12351"
    },
    {
        LibrarianName: "Henry Martinez",
        Gender: "Male",
        Phone: "+1-555-0008",
        Address: "258 Spruce Drive, Mountain View, State 12352"
    }
];

// Function to recreate tables and insert sample data
const recreateAndInsertLibrarians = async () => {
    try {
        console.log("Forcing database sync to recreate tables...");

        // Force sync - this will drop and recreate tables
        await db.sequelize.sync({ force: true });
        console.log("Database synced successfully with force=true.");

        // Insert sample users first
        const User = db.users;
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

        console.log("Inserting sample users...");
        const createdUsers = await User.bulkCreate(sampleUsers);
        console.log(`Successfully inserted ${createdUsers.length} users.`);

        // Insert sample librarians
        console.log("Inserting sample librarians...");
        const createdLibrarians = await Librarian.bulkCreate(sampleLibrarians);

        console.log(`\nSuccessfully inserted ${createdLibrarians.length} librarians:`);
        createdLibrarians.forEach(librarian => {
            console.log(`- ID: ${librarian.LibrarianID} | ${librarian.LibrarianName} (${librarian.Gender}) | Phone: ${librarian.Phone}`);
        });

        // Insert sample books
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

        console.log("\nInserting sample books...");
        const createdBooks = await Book.bulkCreate(sampleBooks);
        console.log(`Successfully inserted ${createdBooks.length} books.`);

        console.log("\n📊 FINAL SUMMARY:");
        const maleLibrarians = createdLibrarians.filter(lib => lib.Gender === 'Male');
        const femaleLibrarians = createdLibrarians.filter(lib => lib.Gender === 'Female');
        const availableBooks = createdBooks.filter(book => !book.borrowed);
        const borrowedBooks = createdBooks.filter(book => book.borrowed);

        console.log(`👥 Users: ${createdUsers.length}`);
        console.log(`👨‍💼 Librarians: ${createdLibrarians.length} (${maleLibrarians.length} Male, ${femaleLibrarians.length} Female)`);
        console.log(`📚 Total Books: ${createdBooks.length}`);
        console.log(`📖 Available Books: ${availableBooks.length}`);
        console.log(`📕 Borrowed Books: ${borrowedBooks.length}`);

    } catch (error) {
        console.error("Error recreating and inserting data:", error);
    } finally {
        // Close database connection
        await db.sequelize.close();
        console.log("\nDatabase connection closed.");
    }
};

// Run the recreation and insertion
recreateAndInsertLibrarians();