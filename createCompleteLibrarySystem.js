import db from "./app/models/index.js";

const User = db.users;
const Book = db.books;
const Librarian = db.librarians;
const Borrow = db.borrows;

// Sample borrow data - representing current and past borrowing transactions
const sampleBorrows = [
    {
        UserID: 1,
        LibrarianID: 1,
        BookId: 3,
        BorrowBookDate: '2024-09-15',
        ReturnBookDate: null,
        IsBorrow: true
    },
    {
        UserID: 2,
        LibrarianID: 2,
        BookId: 6,
        BorrowBookDate: '2024-09-20',
        ReturnBookDate: null,
        IsBorrow: true
    },
    {
        UserID: 3,
        LibrarianID: 1,
        BookId: 9,
        BorrowBookDate: '2024-09-25',
        ReturnBookDate: null,
        IsBorrow: true
    },
    {
        UserID: 4,
        LibrarianID: 3,
        BookId: 1,
        BorrowBookDate: '2024-08-10',
        ReturnBookDate: '2024-08-25',
        IsBorrow: false
    },
    {
        UserID: 5,
        LibrarianID: 2,
        BookId: 2,
        BorrowBookDate: '2024-08-15',
        ReturnBookDate: '2024-09-01',
        IsBorrow: false
    },
    {
        UserID: 1,
        LibrarianID: 4,
        BookId: 4,
        BorrowBookDate: '2024-07-20',
        ReturnBookDate: '2024-08-05',
        IsBorrow: false
    },
    {
        UserID: 6,
        LibrarianID: 1,
        BookId: 5,
        BorrowBookDate: '2024-08-01',
        ReturnBookDate: '2024-08-18',
        IsBorrow: false
    }
];

// Function to recreate all tables and insert complete sample data
const recreateCompleteLibrarySystem = async () => {
    try {
        console.log("🔄 Forcing database sync to recreate all tables...");

        // Force sync - this will drop and recreate tables in correct order
        await db.sequelize.sync({ force: true });
        console.log("✅ Database synced successfully with force=true.");

        // 1. Insert Users
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

        console.log("👥 Inserting sample users...");
        const createdUsers = await User.bulkCreate(sampleUsers);
        console.log(`✅ Successfully inserted ${createdUsers.length} users.`);

        // 2. Insert Librarians
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
            }
        ];

        console.log("👨‍💼 Inserting sample librarians...");
        const createdLibrarians = await Librarian.bulkCreate(sampleLibrarians);
        console.log(`✅ Successfully inserted ${createdLibrarians.length} librarians.`);

        // 3. Insert Books
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

        console.log("📚 Inserting sample books...");
        const createdBooks = await Book.bulkCreate(sampleBooks);
        console.log(`✅ Successfully inserted ${createdBooks.length} books.`);

        // 4. Insert Borrow Records
        console.log("📋 Inserting sample borrow records...");
        const createdBorrows = await Borrow.bulkCreate(sampleBorrows);

        console.log(`✅ Successfully inserted ${createdBorrows.length} borrow records:`);
        createdBorrows.forEach(borrow => {
            const status = borrow.IsBorrow ? "📕 Currently Borrowed" : "📗 Returned";
            const returnInfo = borrow.ReturnBookDate ? ` (Returned: ${borrow.ReturnBookDate})` : "";
            console.log(`- Borrow ID: ${borrow.BorrowID} | User: ${borrow.UserID} | Book: ${borrow.BookId} | Librarian: ${borrow.LibrarianID} | ${status}${returnInfo}`);
        });

        console.log("\n📊 COMPLETE LIBRARY SYSTEM SUMMARY:");
        const currentlyBorrowedRecords = createdBorrows.filter(b => b.IsBorrow);
        const returnedRecords = createdBorrows.filter(b => !b.IsBorrow);
        const maleLibrarians = createdLibrarians.filter(lib => lib.Gender === 'Male');
        const femaleLibrarians = createdLibrarians.filter(lib => lib.Gender === 'Female');
        const availableBooks = createdBooks.filter(book => !book.borrowed);
        const borrowedBooks = createdBooks.filter(book => book.borrowed);

        console.log(`👥 Users: ${createdUsers.length}`);
        console.log(`👨‍💼 Librarians: ${createdLibrarians.length} (${maleLibrarians.length} Male, ${femaleLibrarians.length} Female)`);
        console.log(`📚 Total Books: ${createdBooks.length}`);
        console.log(`📖 Available Books: ${availableBooks.length}`);
        console.log(`📕 Currently Borrowed Books: ${borrowedBooks.length}`);
        console.log(`📋 Total Borrow Records: ${createdBorrows.length}`);
        console.log(`📕 Currently Active Borrows: ${currentlyBorrowedRecords.length}`);
        console.log(`📗 Returned Books Records: ${returnedRecords.length}`);

        console.log("\n🎯 READY TO TEST:");
        console.log("- Books API: http://localhost:8080/api/books");
        console.log("- Users API: http://localhost:8080/api/users");
        console.log("- Librarians API: http://localhost:8080/api/librarians");
        console.log("- Borrows API: http://localhost:8080/api/borrows");
        console.log("- Borrow Statistics: http://localhost:8080/api/borrows/statistics");

    } catch (error) {
        console.error("❌ Error recreating complete library system:", error);
    } finally {
        // Close database connection
        await db.sequelize.close();
        console.log("\n✅ Database connection closed.");
    }
};

// Run the complete recreation
recreateCompleteLibrarySystem();