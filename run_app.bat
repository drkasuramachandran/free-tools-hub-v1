@echo off
cd /d "%~dp0"

echo Starting FreeTools Hub...
echo.

if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting development server...
call npm run dev

pause