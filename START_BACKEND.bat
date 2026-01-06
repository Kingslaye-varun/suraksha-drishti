@echo off
echo ============================================================
echo SURAKSHA DRISHTI - Starting Backend Server
echo ============================================================
echo.

cd api

echo Checking Python...
python --version
echo.

echo Starting Flask server...
echo Backend will run on: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo ============================================================
echo.

python app.py

pause
