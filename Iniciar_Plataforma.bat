@echo off
title Aula Plus - Servidor Local
color 0a

:: Ir al directorio exacto del proyecto primaria
cd /d "C:\Users\Elizabeth\Desktop\primaria"

echo ==========================================
echo    INICIANDO PLATAFORMA PLUS (LOCALHOST)
echo ==========================================
echo.

echo [1/2] El servidor correra en: http://localhost:9005
echo.

echo [2/2] Iniciando servidor y abriendo navegador...
echo.

:: Abrir el navegador en el INDEX
start http://localhost:9005/index.html

:: Iniciar el servidor
npx serve ./ -p 9005
