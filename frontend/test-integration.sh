#!/bin/bash

echo "=== Library Management System Integration Test ==="
echo ""

# Test if the backend API is running
echo "1. Testing Backend API Connection..."
curl -s http://localhost:8080/api/books > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend API is running on http://localhost:8080"
else
    echo "❌ Backend API is not running. Please start the Node.js server first."
    echo "   Run: cd .. && node server.js"
    exit 1
fi

echo ""
echo "2. Testing API Endpoints..."

# Test Books API
echo "📚 Testing Books API..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/books | grep -q "200" && echo "   ✅ Books API working" || echo "   ❌ Books API failed"

# Test Users API
echo "👥 Testing Users API..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/users | grep -q "200" && echo "   ✅ Users API working" || echo "   ❌ Users API failed"

# Test Librarians API
echo "👨‍💼 Testing Librarians API..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/librarians | grep -q "200" && echo "   ✅ Librarians API working" || echo "   ❌ Librarians API failed"

# Test Borrowings API
echo "📖 Testing Borrowings API..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/borrows | grep -q "200" && echo "   ✅ Borrowings API working" || echo "   ❌ Borrowings API failed"

echo ""
echo "3. Frontend Setup Status..."
if [ -d "node_modules" ]; then
    echo "✅ Vue.js dependencies installed"
else
    echo "❌ Vue.js dependencies not installed. Run: npm install"
fi

if [ -f "package.json" ]; then
    echo "✅ Vue.js project configured"
else
    echo "❌ Vue.js project not configured"
fi

echo ""
echo "=== Integration Test Complete ==="
echo ""
echo "🚀 To start the Vue.js frontend:"
echo "   npm run serve"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080"
echo ""
echo "📖 To test the full integration:"
echo "   1. Start backend: cd .. && node server.js"
echo "   2. Start frontend: npm run serve"
echo "   3. Open browser: http://localhost:3000"