# POSTMAN API TESTING - Users CRUD Operations

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
    "user_name": "john_smith"
}
```

#### **Example 2: Another User**
```json
{
    "user_name": "mary_johnson"
}
```

#### **Example 3: User with Underscore**
```json
{
    "user_name": "alex_wilson_2024"
}
```

*Note: user_name must be unique. createdAt and updatedAt are automatically generated.*

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
        "user_name": "john_doe",
        "createdAt": "2025-10-09T08:12:51.146Z",
        "updatedAt": "2025-10-09T08:12:51.146Z"
    },
    {
        "user_id": 2,
        "user_name": "jane_smith",
        "createdAt": "2025-10-09T08:12:51.146Z",
        "updatedAt": "2025-10-09T08:12:51.146Z"
    }
    // ... more users
]
```

---

## 3. 🔍 **GET SPECIFIC USER (GET Request)**

### **Endpoint:** `GET http://localhost:8080/api/users/{user_id}`

#### **Example:** `GET http://localhost:8080/api/users/1`

### **Expected Response:**
```json
{
    "user_id": 1,
    "user_name": "john_doe",
    "createdAt": "2025-10-09T08:12:51.146Z",
    "updatedAt": "2025-10-09T08:12:51.146Z"
}
```

---

## 4. ✏️ **UPDATE USER (PUT Request)**

### **Endpoint:** `PUT http://localhost:8080/api/users/{user_id}`

### **Headers:**
```
Content-Type: application/json
```

#### **Example 1: Update Username**
**URL:** `PUT http://localhost:8080/api/users/1`
```json
{
    "user_name": "john_doe_updated"
}
```

#### **Example 2: Another Update**
**URL:** `PUT http://localhost:8080/api/users/5`
```json
{
    "user_name": "new_username_2024"
}
```

*Note: updatedAt will be automatically updated when the record is modified.*

---

## 5. 🗑️ **DELETE USER (DELETE Request)**

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

## ⏰ **Automatic Timestamp Fields**

All users automatically include timestamp fields:
- **`createdAt`**: Automatically set when the user is first created
- **`updatedAt`**: Automatically updated whenever the user record is modified

These fields are managed by Sequelize and cannot be manually set in POST/PUT requests.

---

## 🚨 **Error Responses**

### **Missing Required Field:**
```json
{
    "message": "User name can not be empty!"
}
```

### **User Not Found:**
```json
{
    "message": "Cannot find User with user_id=999."
}
```

### **Duplicate Username:**
```json
{
    "message": "Username already exists!"
}
```

---

## 📝 **Testing Steps in Postman:**

1. **Set Method:** POST, GET, PUT, or DELETE
2. **Enter URL:** http://localhost:8080/api/users
3. **Add Headers:** Content-Type: application/json (for POST/PUT)
4. **Add Body:** Raw JSON (for POST/PUT requests)
5. **Send Request**
6. **Check Response**

---

## 🎯 **Quick Test Collection:**

### Test 1: Create a new user
```
POST http://localhost:8080/api/users
Body: {"user_name": "test_user_2024"}
```

### Test 2: Get all users
```
GET http://localhost:8080/api/users
```

### Test 3: Get specific user
```
GET http://localhost:8080/api/users/1
```

### Test 4: Update user
```
PUT http://localhost:8080/api/users/1
Body: {"user_name": "updated_username"}
```

### Test 5: Delete user
```
DELETE http://localhost:8080/api/users/1
```

---

## 📚 **Relationship Notes:**

- Users can borrow books (referenced in books.user_id)
- Users are tracked in borrowing records (borrows.UserID)
- Deleting a user may affect books and borrow records with foreign key constraints

---

## 🔍 **Sample Users in Database:**

The system comes pre-populated with these users:
1. john_doe
2. jane_smith  
3. mike_johnson
4. sarah_williams
5. david_brown
6. emily_davis
7. chris_wilson
8. lisa_anderson
9. kevin_taylor
10. anna_martin

All users include proper timestamp tracking for creation and modification dates.