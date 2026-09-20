@echo off
chcp 65001 >nul
title 科研数据管理平台原型 - 预览服务 (http://localhost:3100)
cd /d "%~dp0"
echo 正在启动预览服务，启动后浏览器会自动打开 http://localhost:3100
echo 关闭这个黑色窗口即可停止服务。
echo.
start "" http://localhost:3100
"%LOCALAPPDATA%\OfficePLUSAgent\resources\runtime\node.exe" node_modules\vite\bin\vite.js --port=3100 --strictPort
pause
