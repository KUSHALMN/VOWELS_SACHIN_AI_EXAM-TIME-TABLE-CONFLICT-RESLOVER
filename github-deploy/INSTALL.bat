@echo off
echo Installing dependencies...
call npm install
cd client
call npm install
cd ..
echo.
echo Installation complete!
echo Run: npm run dev (backend) and cd client ^&^& npm run dev (frontend)
pause
