@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title Leonardo AI API 工具

REM 創建日誌目錄
if not exist logs mkdir logs

REM 設定日誌檔案名稱（包含日期和時間）
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set LOGFILE=logs\leonardo-tool-%TIMESTAMP%.log

REM 記錄啟動時間
echo [%date% %time%] Leonardo AI API 工具開始執行 > "%LOGFILE%"

:MAIN_MENU
cls
echo ===== Leonardo AI API 工具 =====
echo.
echo 請選擇操作:
echo [1] 安裝必要套件
echo [2] 啟動 API 服務
echo [3] 啟動 Web UI
echo [4] 生成圖片
echo [5] 查看模型列表
echo [6] 查看生成記錄
echo [7] 檢查環境設定
echo [8] 查看日誌檔案
echo [0] 退出
echo.
echo 當前日誌檔案: %LOGFILE%
echo.
set /p choice=請輸入選項編號:

if "%choice%"=="1" goto INSTALL_PACKAGES
if "%choice%"=="2" goto START_API_SERVER
if "%choice%"=="3" goto START_WEB_UI
if "%choice%"=="4" goto GENERATE_IMAGE
if "%choice%"=="5" goto LIST_MODELS
if "%choice%"=="6" goto VIEW_HISTORY
if "%choice%"=="7" goto CHECK_ENV
if "%choice%"=="8" goto VIEW_LOGS
if "%choice%"=="0" goto EXIT

echo 無效的選項，請重新選擇。
timeout /t 2 >nul
goto MAIN_MENU

:INSTALL_PACKAGES
cls
echo ===== 安裝必要套件 =====
echo.
echo [資訊] 檢查 Node.js 是否已安裝...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [錯誤] 未找到 Node.js。請先安裝 Node.js。
    pause
    goto MAIN_MENU
)

echo [資訊] 正在安裝必要的套件...
call npm install >> "%LOGFILE%" 2>&1
echo [成功] 套件安裝完成。
pause
goto MAIN_MENU

:START_API_SERVER
cls
echo ===== 啟動 API 服務 =====
echo.
echo [資訊] 正在啟動 Leonardo AI API 服務...
echo [資訊] 服務啟動後，API 將在 http://localhost:3000 運行
call npm run server >> "%LOGFILE%" 2>&1
pause
goto MAIN_MENU

:START_WEB_UI
cls
echo ===== 啟動 Web UI =====
echo.
echo [資訊] 正在啟動 Web UI...
echo [資訊] UI 將在 http://localhost:3001 運行
call npm run client >> "%LOGFILE%" 2>&1
pause
goto MAIN_MENU

:GENERATE_IMAGE
cls
echo ===== 生成圖片 =====
echo.
set /p prompt=請輸入圖片描述:
set /p model=請輸入模型 ID (直接按 Enter 使用預設模型):
if "%model%"=="" set model="default"
echo [資訊] 正在生成圖片...
call npm run generate "%prompt%" "%model%" >> "%LOGFILE%" 2>&1
pause
goto MAIN_MENU

:LIST_MODELS
cls
echo ===== 查看可用模型列表 =====
echo.
call npm run models >> "%LOGFILE%" 2>&1
pause
goto MAIN_MENU

:VIEW_HISTORY
cls
echo ===== 查看生成記錄 =====
echo.
call npm run history >> "%LOGFILE%" 2>&1
pause
goto MAIN_MENU

:CHECK_ENV
cls
echo ===== 檢查環境設定 =====
echo.
if not exist .env (
    echo [警告] 未找到 .env 檔案
) else (
    echo [成功] 找到 .env 檔案
    echo [資訊] .env 檔案內容:
    type .env
)
echo.
echo [資訊] Node.js 版本:
node -v
echo [資訊] npm 版本:
npm -v
pause
goto MAIN_MENU

:VIEW_LOGS
cls
echo ===== 查看日誌檔案 =====
echo.
dir /b /o-d logs\*.log
echo.
set /p log_file=請輸入要查看的日誌檔案名稱 (直接按 Enter 查看當前日誌):
if "%log_file%"=="" (
    type "%LOGFILE%"
) else (
    type "logs\%log_file%"
)
pause
goto MAIN_MENU

:EXIT
cls
echo 感謝使用 Leonardo AI API 工具！
timeout /t 2 >nul
exit /b 0
