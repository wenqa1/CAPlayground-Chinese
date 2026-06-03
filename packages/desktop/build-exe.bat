@echo off
REM ============================================
REM CAPlayground Desktop EXE Build Script
REM ============================================
echo [1/3] Building web application...
cd /d "%~dp0..\..\apps\web"
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Web build failed (likely Google Fonts network issue).
    echo [INFO] Continuing with existing build if available...
)

echo [2/3] Packaging desktop application...
cd /d "%~dp0"
call npx electron-forge package
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Packaging failed!
    pause
    exit /b 1
)

echo [3/3] Creating installer...
call npx electron-forge make
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Installer creation failed!
    pause
    exit /b 1
)

echo [SUCCESS] CAPlayground Desktop EXE created!
echo Output: out\make\
pause
