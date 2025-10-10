# Frontend - Library Management System

Vue.js frontend application for the Library Management System API.

## Features

- 📊 **Dashboard** - Overview with statistics and recent activity
- 📚 **Books Management** - CRUD operations for books with search and pagination
- 👥 **Users Management** - User registration and management
- 👨‍💼 **Librarians Management** - Librarian profiles and information
- 📖 **Borrowing System** - Book borrowing and return functionality
- 🎨 **Responsive Design** - Bootstrap-powered responsive interface
- 🔄 **Real-time Updates** - Live data synchronization with backend API

## Technology Stack

- **Framework**: Vue.js 3 with Composition API
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome 6
- **Build Tool**: Vue CLI 5

## Prerequisites

Before running the frontend application, make sure you have:

1. Node.js (v14 or higher) installed
2. The backend API server running on `http://localhost:8080`
3. PostgreSQL database configured and running

## Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run serve
   # or
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080`

## Available Scripts

```bash
# Start development server
npm run serve

# Build for production
npm run build

# Run linter
npm run lint

# Start dev server on port 3000
npm run dev
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Reusable Vue components
│   ├── views/              # Page components
│   │   ├── Dashboard.vue   # Dashboard with statistics
│   │   ├── Books.vue       # Books management
│   │   ├── Users.vue       # Users management
│   │   ├── Librarians.vue  # Librarians management
│   │   └── Borrowing.vue   # Borrowing system
│   ├── services/           # API service layer
│   │   ├── api.js         # Axios configuration
│   │   ├── bookService.js # Books API calls
│   │   ├── userService.js # Users API calls
│   │   ├── librarianService.js # Librarians API calls
│   │   └── borrowService.js    # Borrowing API calls
│   ├── router/
│   │   └── index.js       # Vue Router configuration
│   ├── App.vue            # Main application component
│   └── main.js            # Application entry point
├── package.json
└── vue.config.js          # Vue CLI configuration
```

## Features Detail

### Dashboard
- Real-time statistics (total books, users, borrowings)
- Recent borrowing activity
- Available books overview
- Quick navigation cards

### Books Management
- Complete CRUD operations
- Search by title or author
- Filter by availability status
- Pagination for large datasets
- Book status tracking (available/borrowed)

### Users Management
- User registration and profile management
- Username uniqueness validation
- User search functionality
- Borrowing history tracking

### Librarians Management
- Librarian profile creation and editing
- Gender and contact information management
- Unique phone number validation
- Address management

### Borrowing System
- Interactive borrowing workflow
- Book availability checking
- Return date tracking
- Borrowing statistics
- Status filtering (borrowed/returned/all)

## API Integration

The frontend communicates with the backend API through service classes:

- **Base URL**: `http://localhost:8080/api`
- **Authentication**: Ready for token-based auth (currently disabled)
- **Error Handling**: Global error interceptors
- **Request Timeout**: 10 seconds

### API Endpoints Used

```javascript
// Books
GET    /api/books              - Get all books
GET    /api/books/:id          - Get book by ID
GET    /api/books/available    - Get available books
POST   /api/books             - Create book
PUT    /api/books/:id         - Update book
DELETE /api/books/:id         - Delete book

// Users
GET    /api/users             - Get all users
GET    /api/users/:id         - Get user by ID
POST   /api/users            - Create user
PUT    /api/users/:id        - Update user
DELETE /api/users/:id        - Delete user

// Librarians
GET    /api/librarians        - Get all librarians
POST   /api/librarians       - Create librarian
PUT    /api/librarians/:id   - Update librarian
DELETE /api/librarians/:id   - Delete librarian

// Borrowing
GET    /api/borrows           - Get all borrowings
POST   /api/borrows/borrow    - Borrow book
PUT    /api/borrows/return/:id - Return book
```

## Styling and UI

- **Bootstrap 5**: Modern, responsive components
- **Font Awesome 6**: Comprehensive icon library
- **Custom CSS**: Enhanced styling for better UX
- **Responsive Design**: Mobile-first approach
- **Dark Theme Support**: Table headers and navigation

## Development Notes

- Vue 3 Composition API ready (currently using Options API)
- TypeScript support can be easily added
- PWA capabilities ready to be implemented
- State management (Vuex/Pinia) can be added for complex state
- Authentication system ready to be integrated

## Build and Deployment

```bash
# Build for production
npm run build

# The built files will be in the 'dist' directory
# Deploy the 'dist' folder to your web server
```

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow Vue.js style guide
2. Use consistent naming conventions
3. Add proper error handling
4. Test API integrations
5. Ensure responsive design

## License

This project is for educational purposes.