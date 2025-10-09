# USER API TESTING - Complete Guide

## 📋 **API Base URL**
```
http://localhost:8080/api/users
```

---

## 1. 👤 **CREATE NEW USER (POST Request)**

### **Endpoint:** `POST http://localhost:8080/api/users`

### **Headers:**
```
Content-Type: application/json
```

### **JSON Body Examples:**

#### **Example 1: Basic User**
```json
{
    "user_name": "alice_wonder"
}
```

#### **Example 2: Another User**
```json
{
    "user_name": "bob_builder"
}
```

#### **Example 3: User with Underscore**
```json
{
    "user_name": "mary_jane"
}
```

#### **Example 4: User with Numbers**
```json
{
    "user_name": "user123"
}
```

**Expected Response:**
```json
{
    "user_id": 11,
    "user_name": "alice_wonder"
}
```

---

## 2. 👥 **GET ALL USERS (GET Request)**

### **Endpoint:** `GET http://localhost:8080/api/users`
- No body required
- Returns array of all users

### **Expected Response:**
```json
[
    {
        "user_id": 1,
        "user_name": "john_doe"
    },
    {
        "user_id": 2,
        "user_name": "jane_smith"
    },
    {
        "user_id": 3,
        "user_name": "mike_johnson"
    }
    // ... more users
]
```

---

## 3. 🔍 **GET SPECIFIC USER BY ID (GET Request)**

### **Endpoint:** `GET http://localhost:8080/api/users/{user_id}`

#### **Example:** `GET http://localhost:8080/api/users/1`

### **Expected Response:**
```json
{
    "user_id": 1,
    "user_name": "john_doe"
}
```

---

## 4. 🔍 **GET USER BY USERNAME (GET Request)**

### **Endpoint:** `GET http://localhost:8080/api/users/username/{username}`

#### **Example:** `GET http://localhost:8080/api/users/username/john_doe`

### **Expected Response:**
```json
{
    "user_id": 1,
    "user_name": "john_doe"
}
```

---

## 5. ✏️ **UPDATE USER (PUT Request)**

### **Endpoint:** `PUT http://localhost:8080/api/users/{user_id}`

### **Headers:**
```
Content-Type: application/json
```

#### **Example: Update Username**
**URL:** `PUT http://localhost:8080/api/users/1`
```json
{
    "user_name": "john_doe_updated"
}
```

### **Expected Response:**
```json
{
    "message": "User was updated successfully."
}
```

---

## 6. 🗑️ **DELETE USER (DELETE Request)**

### **Endpoint:** `DELETE http://localhost:8080/api/users/{user_id}`

#### **Example:** `DELETE http://localhost:8080/api/users/5`
- No body required

### **Expected Response:**
```json
{
    "message": "User was deleted successfully!"
}
```

---

## 7. 🔍 **FILTER USERS (GET with Query Parameters)**

### **Filter by Username:**
`GET http://localhost:8080/api/users?user_name=john`

### **Expected Response:**
```json
[
    {
        "user_id": 1,
        "user_name": "john_doe"
    }
]
```

---

## 🚨 **Error Responses**

### **Missing Required Field:**
```json
{
    "message": "User name can not be empty!"
}
```

### **Duplicate Username:**
```json
{
    "message": "User name already exists. Please choose a different name."
}
```

### **User Not Found:**
```json
{
    "message": "Cannot find User with user_id=999."
}
```

---

## 📊 **SAMPLE USERS DATA**

The database currently contains these users:

| user_id | user_name      |
|---------|----------------|
| 1       | john_doe       |
| 2       | jane_smith     |
| 3       | mike_johnson   |
| 4       | sarah_williams |
| 5       | david_brown    |
| 6       | emily_davis    |
| 7       | chris_wilson   |
| 8       | lisa_anderson  |
| 9       | kevin_taylor   |
| 10      | anna_martin    |

---

## 🔗 **RELATIONSHIP WITH BOOKS**

Users are connected to books through the `user_id` field in books:

### **Books Borrowed by Users:**
- **User 1 (john_doe):** 1984
- **User 2 (jane_smith):** Harry Potter and the Philosopher's Stone  
- **User 3 (mike_johnson):** Fahrenheit 451

### **Get Books by User (Custom Query):**
You can get books borrowed by a specific user:
`GET http://localhost:8080/api/books?borrowed=true&user_id=1`

---

## 🎯 **QUICK TEST COLLECTION**

### Test 1: Create a new user
```
POST http://localhost:8080/api/users
Body: {"user_name": "test_user"}
```

### Test 2: Get all users
```
GET http://localhost:8080/api/users
```

### Test 3: Get specific user
```
GET http://localhost:8080/api/users/1
```

### Test 4: Get user by username
```
GET http://localhost:8080/api/users/username/john_doe
```

### Test 5: Update user
```
PUT http://localhost:8080/api/users/1
Body: {"user_name": "john_doe_new"}
```

### Test 6: Search users
```
GET http://localhost:8080/api/users?user_name=jane
```

### Test 7: Delete user
```
DELETE http://localhost:8080/api/users/1
```

---

## 🔧 **COMPLETE API ENDPOINTS SUMMARY**

### **Users API:** `/api/users`
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/username/:username` - Get user by username
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `DELETE /api/users` - Delete all users
- `GET /api/users?user_name=search` - Filter users

### **Books API:** `/api/books`
- `GET /api/books` - Get all books
- `GET /api/books/available` - Get available books
- `GET /api/books/:id` - Get specific book
- `POST /api/books` - Create book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### **Tutorials API:** `/api/tutorials`
- `GET /api/tutorials` - Get all tutorials
- And all other tutorial CRUD operations