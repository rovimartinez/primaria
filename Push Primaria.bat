@echo off
title Push Primaria - GitHub Cockpit
cd /d "%~dp0"
cls

:: Iniciar el sincronizador visual interactivo
node scripts/push-runner.js

if %errorlevel% neq 0 (
  echo.
  echo  ========================================================================
  echo   [!] El proceso finalizo con codigo %errorlevel%
  echo  ========================================================================
  pause
)
