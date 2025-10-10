@echo off
echo === Library Management System Integration Test ===
echo.

echo 1. Testing Backend API Connection...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/books' -Method GET -TimeoutSec 5; Write-Host '✅ Backend API is running on http://localhost:8080' -ForegroundColor Green } catch { Write-Host '❌ Backend API is not running. Please start the Node.js server first.' -ForegroundColor Red; Write-Host '   Run: cd .. && node server.js' -ForegroundColor Yellow; exit 1 }"

echo.
echo 2. Testing API Endpoints...

echo 📚 Testing Books API...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/books' -Method GET -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '   ✅ Books API working' -ForegroundColor Green } } catch { Write-Host '   ❌ Books API failed' -ForegroundColor Red }"

echo 👥 Testing Users API...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/users' -Method GET -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '   ✅ Users API working' -ForegroundColor Green } } catch { Write-Host '   ❌ Users API failed' -ForegroundColor Red }"

echo 👨‍💼 Testing Librarians API...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/librarians' -Method GET -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '   ✅ Librarians API working' -ForegroundColor Green } } catch { Write-Host '   ❌ Librarians API failed' -ForegroundColor Red }"

echo 📖 Testing Borrowings API...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/borrows' -Method GET -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '   ✅ Borrowings API working' -ForegroundColor Green } } catch { Write-Host '   ❌ Borrowings API failed' -ForegroundColor Red }"

echo.
echo 3. Frontend Setup Status...
if exist "node_modules" (
    echo ✅ Vue.js dependencies installed
) else (
    echo ❌ Vue.js dependencies not installed. Run: npm install
)

if exist "package.json" (
    echo ✅ Vue.js project configured
) else (
    echo ❌ Vue.js project not configured
)

echo.
echo === Integration Test Complete ===
echo.
echo 🚀 To start the Vue.js frontend:
echo    npm run serve
echo.
echo 🌐 Access URLs:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8080
echo.
echo 📖 To test the full integration:
echo    1. Start backend: cd .. ^&^& node server.js
echo    2. Start frontend: npm run serve
echo    3. Open browser: http://localhost:3000

pause