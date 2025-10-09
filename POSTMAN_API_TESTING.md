# POSTMAN API TESTING - Books CRUD Operations

## 📋 **API Base URL**
```
http://localhost:8080/api/books
```

---

## 1. 📚 **CREATE NEW BOOK (POST Request)**

### **Endpoint:** `POST http://localhost:8080/api/books`

### **Headers:**
```
Content-Type: application/json
```

### **JSON Body Examples:**

#### **Example 1: Available Book**
```json
{
    "title": "The Alchemist",
    "author": "Paulo Coelho",
    "borrowed": false,
    "user_id": null
}
```

#### **Example 2: Borrowed Book**
```json
{
    "title": "Dune",
    "author": "Frank Herbert",
    "borrowed": true,
    "user_id": 5
}
```

#### **Example 3: Minimal Required Fields Only**
```json
{
    "title": "Brave New World",
    "author": "Aldous Huxley"
}
```
*Note: borrowed will default to false, user_id will be null*

#### **Example 4: Programming Book**
```json
{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "borrowed": false,
    "user_id": null
}
```

#### **Example 5: Classic Literature**
```json
{
    "title": "One Hundred Years of Solitude",
    "author": "Gabriel García Márquez",
    "borrowed": true,
    "user_id": 7
}
```

---

## 2. 📖 **GET ALL BOOKS (GET Request)**

### **Endpoint:** `GET http://localhost:8080/api/books`
- No body required
- Returns array of all books

### **Expected Response:**
```json
[
    {
        "book_id": 1,
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "borrowed": false,
        "user_id": null,
        "createdAt": "2025-10-09T08:19:22.515Z",
        "updatedAt": "2025-10-09T08:19:22.515Z",
        "user": null
    },
    {
        "book_id": 3,
        "title": "1984",
        "author": "George Orwell",
        "borrowed": true,
        "user_id": 1,
        "createdAt": "2025-10-09T08:19:22.515Z",
        "updatedAt": "2025-10-09T08:19:22.515Z",
        "user": {
            "user_id": 1,
            "user_name": "john_doe",
            "createdAt": "2025-10-09T08:19:22.496Z",
            "updatedAt": "2025-10-09T08:19:22.496Z"
        }
    }
    // ... more books
]
```

---

## 3. 🔍 **GET SPECIFIC BOOK (GET Request)**

### **Endpoint:** `GET http://localhost:8080/api/books/{book_id}`

#### **Example:** `GET http://localhost:8080/api/books/1`

### **Expected Response:**
```json
{
    "book_id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "borrowed": false,
    "user_id": null,
    "createdAt": "2025-10-09T08:19:22.515Z",
    "updatedAt": "2025-10-09T08:19:22.515Z",
    "user": null
}
```

### **Expected Response (Book with User):**
```json
{
    "book_id": 3,
    "title": "1984",
    "author": "George Orwell",
    "borrowed": true,
    "user_id": 1,
    "createdAt": "2025-10-09T08:19:22.515Z",
    "updatedAt": "2025-10-09T08:19:22.515Z",
    "user": {
        "user_id": 1,
        "user_name": "john_doe",
        "createdAt": "2025-10-09T08:19:22.496Z",
        "updatedAt": "2025-10-09T08:19:22.496Z"
    }
}
```

---

## 4. ✏️ **UPDATE BOOK (PUT Request)**

### **Endpoint:** `PUT http://localhost:8080/api/books/{book_id}`

### **Headers:**
```
Content-Type: application/json
```

#### **Example 1: Mark Book as Borrowed**
**URL:** `PUT http://localhost:8080/api/books/1`
```json
{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "borrowed": true,
    "user_id": 10
}
```

#### **Example 2: Return Book (Mark as Available)**
**URL:** `PUT http://localhost:8080/api/books/3`
```json
{
    "title": "1984",
    "author": "George Orwell",
    "borrowed": false,
    "user_id": null
}
```

#### **Example 3: Update Title Only**
**URL:** `PUT http://localhost:8080/api/books/5`
```json
{
    "title": "The Catcher in the Rye - Revised Edition"
}
```

---

## 5. 🗑️ **DELETE BOOK (DELETE Request)**

### **Endpoint:** `DELETE http://localhost:8080/api/books/{book_id}`

#### **Example:** `DELETE http://localhost:8080/api/books/5`
- No body required

### **Expected Response:**
```json
{
    "message": "Book was deleted successfully!"
}
```

---

## ⏰ **Automatic Timestamp Fields**

All books automatically include timestamp fields:
- **`createdAt`**: Automatically set when the book is first created
- **`updatedAt`**: Automatically updated whenever the book record is modified

These fields are managed by Sequelize and cannot be manually set in POST/PUT requests.

---

## 👤 **User Relationship Information**

All book responses now include detailed user information when the book is borrowed:

### **Available Book (not borrowed):**
```json
{
    "book_id": 1,
    "title": "The Great Gatsby",
    "borrowed": false,
    "user_id": null,
    "createdAt": "2025-10-09T08:19:22.515Z",
    "updatedAt": "2025-10-09T08:19:22.515Z",
    "user": null
}
```

### **Borrowed Book (with user details):**
```json
{
    "book_id": 3,
    "title": "1984", 
    "borrowed": true,
    "user_id": 1,
    "createdAt": "2025-10-09T08:19:22.515Z",
    "updatedAt": "2025-10-09T08:19:22.515Z",
    "user": {
        "user_id": 1,
        "user_name": "john_doe",
        "createdAt": "2025-10-09T08:19:22.496Z",
        "updatedAt": "2025-10-09T08:19:22.496Z"
    }
}
```

**Key Features:**
- **User Information**: When a book is borrowed, full user details are included
- **User Timestamps**: Shows when the user account was created and last modified
- **Null Values**: Available books show `user: null` since no user is borrowing them
- **Real-time Data**: User information is fetched in real-time with each book request

---

## 6. 📚 **GET AVAILABLE BOOKS (GET Request)**

### **Endpoint:** `GET http://localhost:8080/api/books/available`
- Returns only books where borrowed = false

---

## 7. 🔍 **FILTER BOOKS (GET with Query Parameters)**

### **Filter by Title:**
`GET http://localhost:8080/api/books?title=Harry`

### **Filter by Author:**
`GET http://localhost:8080/api/books?author=Tolkien`

### **Filter by Borrowed Status:**
`GET http://localhost:8080/api/books?borrowed=true`

---

## 🚨 **Error Responses**

### **Missing Required Field:**
```json
{
    "message": "Title can not be empty!"
}
```

### **Book Not Found:**
```json
{
    "message": "Cannot find Book with book_id=999."
}
```

### **Validation Error:**
```json
{
    "message": "Author can not be empty!"
}
```

---

## 📝 **Testing Steps in Postman:**

1. **Set Method:** POST, GET, PUT, or DELETE
2. **Enter URL:** http://localhost:8080/api/books
3. **Add Headers:** Content-Type: application/json (for POST/PUT)
4. **Add Body:** Raw JSON (for POST/PUT requests)
5. **Send Request**
6. **Check Response**

---

## 🎯 **Quick Test Collection:**

### Test 1: Create a new book
```
POST http://localhost:8080/api/books
Body: {"title": "Test Book", "author": "Test Author"}
```

### Test 2: Get all books
```
GET http://localhost:8080/api/books
```

### Test 3: Get specific book
```
GET http://localhost:8080/api/books/1
```

### Test 4: Update book
```
PUT http://localhost:8080/api/books/1
Body: {"borrowed": true, "user_id": 99}
```

### Test 5: Delete book
```
DELETE http://localhost:8080/api/books/1
```