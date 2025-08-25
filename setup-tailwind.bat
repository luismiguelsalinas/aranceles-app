@echo off
echo ==============================
echo   Configuracion de TailwindCSS
echo ==============================

:: Ir a la carpeta del proyecto
cd /d "%~dp0"

:: Instalar dependencias
echo Instalando TailwindCSS, PostCSS y Autoprefixer...
npm install -D tailwindcss postcss autoprefixer

:: Limpiar cache de npm (por si acaso)
echo Limpiando cache de npm...
npm cache clean --force

:: Crear archivos de configuracion
echo Creando archivos de configuracion...
node .\node_modules\tailwindcss\lib\cli.js init -p

:: Verificacion
if exist tailwind.config.js (
    echo ✅ Tailwind configurado correctamente.
) else (
    echo ❌ Hubo un problema al generar tailwind.config.js
)

pause
