-- Sample INSERT SQL statements for books table
-- These are the actual SQL commands that were executed to insert the sample data

-- Create the books table first (if not exists)
CREATE TABLE IF NOT EXISTS books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    borrowed BOOLEAN DEFAULT false,
    user_id INTEGER
);

-- Insert sample book data
INSERT INTO books (title, author, borrowed, user_id) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', false, NULL),
('To Kill a Mockingbird', 'Harper Lee', false, NULL),
('1984', 'George Orwell', true, 1),
('Pride and Prejudice', 'Jane Austen', false, NULL),
('The Catcher in the Rye', 'J.D. Salinger', false, NULL),
('Harry Potter and the Philosopher''s Stone', 'J.K. Rowling', true, 2),
('The Lord of the Rings', 'J.R.R. Tolkien', false, NULL),
('The Hobbit', 'J.R.R. Tolkien', false, NULL),
('Fahrenheit 451', 'Ray Bradbury', true, 3),
('The Chronicles of Narnia', 'C.S. Lewis', false, NULL);

-- Alternative: Individual INSERT statements
-- INSERT INTO books (title, author, borrowed, user_id) VALUES ('The Great Gatsby', 'F. Scott Fitzgerald', false, NULL);
-- INSERT INTO books (title, author, borrowed, user_id) VALUES ('To Kill a Mockingbird', 'Harper Lee', false, NULL);
-- INSERT INTO books (title, author, borrowed, user_id) VALUES ('1984', 'George Orwell', true, 1);
-- INSERT INTO books (title, author, borrowed, user_id) VALUES ('Pride and Prejudice', 'Jane Austen', false, NULL);
-- INSERT INTO books (title, author, borrowed, user_id) VALUES ('The Catcher in the Rye', 'J.D. Salinger', false, NULL);
-- INSERT INTO books (title, author, borrowed, user_id) VALUES ('Harry Potter and the Philosopher''s Stone', 'J.K. Rowling', true, 2);
-- INSERT INTO books (title, author, borrowed, user_id) VALUES ('The Lord of the Rings', 'J.R.R. Tolkien', false, NULL);
-- INSERT INTO books (title, author, borrowed, user_id) VALUES ('The Hobbit', 'J.R.R. Tolkien', false, NULL);
-- INSERT INTO books (title, author, borrowed, user_id) VALUES ('Fahrenheit 451', 'Ray Bradbury', true, 3);
-- INSERT INTO books (title, author, borrowed, user_id) VALUES ('The Chronicles of Narnia', 'C.S. Lewis', false, NULL);

-- Query to view all inserted data
SELECT book_id, title, author, borrowed, user_id FROM books ORDER BY book_id;

-- Query to view only available books
SELECT book_id, title, author FROM books WHERE borrowed = false ORDER BY title;

-- Query to view only borrowed books
SELECT book_id, title, author, user_id FROM books WHERE borrowed = true ORDER BY title;

-- Query to count books by status
SELECT 
    COUNT(*) as total_books,
    SUM(CASE WHEN borrowed = false THEN 1 ELSE 0 END) as available_books,
    SUM(CASE WHEN borrowed = true THEN 1 ELSE 0 END) as borrowed_books
FROM books;