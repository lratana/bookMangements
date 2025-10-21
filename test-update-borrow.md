# Update Borrow Feature - API Documentation

## New Feature: Update Borrow Record

### Endpoint
**PUT** `/api/borrows/:id`

### Description
Updates an existing borrow record with comprehensive validation and automatic book status management.

### Features
- ✅ Update any field of a borrow record
- ✅ Automatic book status synchronization
- ✅ User/Librarian validation
- ✅ Book availability checking
- ✅ Smart handling of book transfers
- ✅ Comprehensive error handling

### Request Parameters
- `id` (path parameter) - The BorrowID of the record to update

### Request Body (all fields optional)
```json
{
  "UserID": 123,
  "LibrarianID": 456, 
  "BookId": 789,
  "BorrowBookDate": "2025-10-10",
  "ReturnBookDate": "2025-10-20",
  "IsBorrow": true
}
```

### Smart Logic
1. **Book Transfer**: If `BookId` changes and borrow is active:
   - Old book becomes available
   - New book becomes borrowed
   - Validates new book availability

2. **User Transfer**: If `UserID` changes and borrow is active:
   - Updates book's `user_id` field
   - Validates new user exists

3. **Return Status**: If `IsBorrow` changes:
   - `true`: Book becomes borrowed
   - `false`: Book becomes available

### Response Examples

#### Success Response
```json
{
  "message": "Borrow record updated successfully!",
  "data": {
    "BorrowID": 1,
    "UserID": 123,
    "LibrarianID": 456,
    "BookId": 789,
    "BorrowBookDate": "2025-10-10",
    "ReturnBookDate": null,
    "IsBorrow": true,
    "createdAt": "2025-10-10T10:00:00.000Z",
    "updatedAt": "2025-10-10T11:00:00.000Z",
    "user": { ... },
    "librarian": { ... },
    "book": { ... }
  }
}
```

#### Error Responses
```json
// Record not found
{
  "message": "Cannot find Borrow record with BorrowID=999."
}

// Book not available
{
  "message": "New book is already borrowed by someone else!"
}

// User not found
{
  "message": "New user not found!"
}
```

### Test Examples

#### Update Borrow Date
```bash
curl -X PUT http://localhost:8080/api/borrows/1 \
  -H "Content-Type: application/json" \
  -d '{"BorrowBookDate": "2025-10-15"}'
```

#### Transfer Book to Different User
```bash
curl -X PUT http://localhost:8080/api/borrows/1 \
  -H "Content-Type: application/json" \
  -d '{"UserID": 456}'
```

#### Change to Different Book
```bash
curl -X PUT http://localhost:8080/api/borrows/1 \
  -H "Content-Type: application/json" \
  -d '{"BookId": 999}'
```

#### Mark as Returned
```bash
curl -X PUT http://localhost:8080/api/borrows/1 \
  -H "Content-Type: application/json" \
  -d '{"IsBorrow": false, "ReturnBookDate": "2025-10-20"}'
```

### Integration Notes
- Works alongside existing `/api/borrows/return/:id` endpoint
- Maintains data integrity with automatic book status updates
- Provides detailed debugging logs for troubleshooting
- Compatible with existing frontend implementations