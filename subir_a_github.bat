@echo off
setlocal enabledelayedexpansion
title Sincronizador de GitHub - Mundo Toby

:: Ir al directorio exacto del proyecto primaria
cd /d "C:\Users\Elizabeth\Desktop\primaria"

echo ==========================================
echo    SINCRONIZANDO CON GITHUB
echo ==========================================
echo.

:: Verificar configuración de usuario
git config user.email >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Configurando identidad de Git...
    set /p "git_email=Introduce tu email de GitHub: "
    git config --global user.email "!git_email!"
)

git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    set /p "git_name=Introduce tu nombre de usuario de GitHub: "
    git config --global user.name "!git_name!"
)

:: Inicializar git si no existe
if not exist ".git" (
    echo [1/6] Inicializando repositorio Git...
    git init
) else (
    echo [1/6] Repositorio Git ya inicializado.
)

:: Agregar todos los archivos
echo [2/6] Preparando archivos para subir...
git add .

:: Crear el commit
echo [3/6] Creando punto de guardado (commit)...
git commit -m "Actualizacion automatica: %date% %time%"

:: Configurar rama main
echo [4/6] Configurando rama principal (main)...
git branch -M main

:: Configurar el remoto
echo [5/6] Conectando con el repositorio remoto...
git remote add origin https://github.com/rovimartinez/primaria.git 2>nul
if %errorlevel% neq 0 (
    echo (El remoto ya existia, actualizando URL...)
    git remote set-url origin https://github.com/rovimartinez/primaria.git
)

:: Subir a GitHub
echo [6/6] Subiendo archivos a GitHub...
echo.
echo NOTA: Si es la primera vez, se abrira una ventana para iniciar sesion.
git push -u origin main

echo.
echo ==========================================
echo    PROCESO COMPLETADO
echo ==========================================
echo.
pause
