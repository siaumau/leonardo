@echo off
chcp 65001 >nul
echo 正在啟動服務...

echo 檢查並清理端口...
powershell -Command "$processId = (Get-NetTCPConnection -LocalPort 3031 -ErrorAction SilentlyContinue).OwningProcess; if ($processId) { Stop-Process -Id $processId -Force; Write-Host '已清理端口 3031' }"
powershell -Command "$processId = (Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue).OwningProcess; if ($processId) { Stop-Process -Id $processId -Force; Write-Host '已清理端口 3001' }"

timeout /t 2

echo 1. 啟動後端 API 服務...
start cmd /k "npm run server"

echo 2. 等待 5 秒鐘...
timeout /t 5

echo 3. 啟動前端服務...
pushd src\client
start cmd /k "npm start"
popd

echo 服務啟動完成！
echo 後端 API: http://localhost:3031
echo 前端界面: http://localhost:3001
