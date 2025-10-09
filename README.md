# Library Management System API

A complete RESTful API for library management built with Node.js, Express.js, Sequelize ORM, and PostgreSQL.

## Features

### 📚 Book Management
- Create, read, update, delete books
- Search books by title, author
- Track book availability and borrowing status
- Automatic timestamp tracking (createdAt, updatedAt)

### 👥 User Management
- Create and manage library users
- Unique username validation
- User borrowing history tracking
- Complete CRUD operations

### 👨‍💼 Librarian Management
- Librarian profile management
- Gender, phone, and address tracking
- Librarian borrowing record management
- Unique phone number validation

### 📖 Borrowing System
- Book borrowing and return functionality
- Track borrow dates and return dates
- Borrowing status management (IsBorrow flag)
- Complete relationship tracking between users, librarians, and books
- Detailed borrowing records with nested user, librarian, and book information

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Architecture**: MVC (Model-View-Controller)
- **Features**: CORS enabled, ES6 modules, automatic timestamps

## API Endpoints

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `GET /api/books/available` - Get available books
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Librarians
- `GET /api/librarians` - Get all librarians
- `GET /api/librarians/:id` - Get librarian by ID
- `POST /api/librarians` - Create new librarian
- `PUT /api/librarians/:id` - Update librarian
- `DELETE /api/librarians/:id` - Delete librarian

### Borrowing
- `POST /api/borrows/borrow` - Borrow a book
- `PUT /api/borrows/return/:id` - Return a book
- `GET /api/borrows` - Get all borrow records (with user, librarian, and book details)
- `GET /api/borrows/:id` - Get specific borrow record
- `GET /api/borrows/currently-borrowed` - Get currently borrowed books
- `GET /api/borrows/returned` - Get returned books
- `GET /api/borrows/statistics` - Get borrowing statistics

## Database Schema

### Books Table
- `book_id` (Primary Key)
- `title` (String, required)
- `author` (String, required)
- `borrowed` (Boolean, default: false)
- `user_id` (Foreign Key to users)
- `createdAt`, `updatedAt` (Timestamps)

### Users Table
- `user_id` (Primary Key)
- `user_name` (String, unique, required)
- `createdAt`, `updatedAt` (Timestamps)

### Librarians Table
- `LibrarianID` (Primary Key)
- `LibrarianName` (String, required)
- `Gender` (Enum: Male/Female, required)
- `Phone` (String, unique, required)
- `Address` (Text, required)
- `createdAt`, `updatedAt` (Timestamps)

### Borrows Table
- `BorrowID` (Primary Key)
- `UserID` (Foreign Key to users)
- `LibrarianID` (Foreign Key to librarians)
- `BookId` (Foreign Key to books)
- `BorrowBookDate` (Date, required)
- `ReturnBookDate` (Date, nullable)
- `IsBorrow` (Boolean, default: true)
- `createdAt`, `updatedAt` (Timestamps)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-node-express-postgresql-crud
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Database**
   - Update `app/config/db.config.js` with your PostgreSQL credentials
   ```javascript
   export default {
     HOST: "localhost",
     USER: "your_username",
     PASSWORD: "your_password",
     DB: "your_database_name",
     dialect: "postgres",
     PORT: 5432,
     pool: {
       max: 5,
       min: 0,
       acquire: 30000,
       idle: 10000
     }
   };
   ```

4. **Start the server**
   ```bash
   node server.js
   ```

Server will run on `http://localhost:8080`

## Sample API Responses

### Borrow Record with Relationships
```json
{
  "BorrowID": 2,
  "BorrowBookDate": "2024-09-20",
  "ReturnBookDate": null,
  "IsBorrow": true,
  "Users": {
    "user_id": 1,
    "user_name": "john_doe",
    "createdAt": "2025-10-09T08:19:22.496Z",
    "updatedAt": "2025-10-09T08:19:22.496Z"
  },
  "librarians": {
    "LibrarianID": 1,
    "LibrarianName": "Alice Johnson",
    "Gender": "Female",
    "Phone": "+1-555-0001",
    "Address": "123 Main Street, City Center, State 12345",
    "createdAt": "2025-10-09T08:19:22.510Z",
    "updatedAt": "2025-10-09T08:19:22.510Z"
  },
  "books": {
    "book_id": 14,
    "title": "Test Book Creation",
    "author": "Test Author",
    "borrowed": true,
    "user_id": 1,
    "createdAt": "2025-10-09T11:34:08.758Z",
    "updatedAt": "2025-10-09T11:34:08.875Z"
  },
  "createdAt": "2025-10-09T08:19:22.523Z",
  "updatedAt": "2025-10-09T08:19:22.523Z"
}
```

## Features Implemented

✅ Complete CRUD operations for all entities
✅ Automatic timestamp tracking (createdAt, updatedAt)
✅ Foreign key relationships and data integrity
✅ Book borrowing and return system
✅ User and librarian management
✅ Detailed API responses with nested relationships
✅ Data validation and error handling
✅ RESTful API design principles
✅ PostgreSQL database integration
✅ MVC architecture implementation

## Author

Built as a learning project for library management system development.

## License

This project is for educational purposes.