@echo off
title Guard System Starter
color 0A
echo ========================================
echo    GUARD SECURITY SYSTEM
echo ========================================
echo.
echo [1/3] Guard-I Baslatiliyor...
start "Guard-I" cmd /k "cd /d %~dp0Guard\Guard-I && node arven.js"
timeout /t 2 /nobreak >nul

echo [2/3] Guard-II Baslatiliyor...
start "Guard-II" cmd /k "cd /d %~dp0Guard\Guard-II && node arven.js"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo    TUM SISTEMLER BASLATILDI!
echo ========================================
echo.
echo Guard-I     : Kanal + Rol Koruma
echo Guard-II    : Emoji + Sticker + Sunucu Koruma
echo.
pause
