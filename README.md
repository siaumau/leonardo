# Leonardo AI 圖片生成工具

這是一個基於 Leonardo.ai API 的圖片生成工具，提供了簡單的 Web 界面，方便使用者生成 AI 圖片。

## 功能特點

- 提供直觀的 Web 使用者界面
- 支援所有 Leonardo AI 的模型
- 圖片生成與預覽
- 生成歷史記錄查看
- 完整的錯誤處理
- 詳細的日誌記錄

## 系統需求

- Node.js 16.0 或更高版本
- npm 7.0 或更高版本
- Windows 操作系統

## 快速開始

1. 克隆專案：
```bash
git clone [專案URL]
cd leonard
```

2. 安裝依賴：
```bash
npm install
cd src/client
npm install
cd ../..
```

3. 設定環境變數：
   - 複製 `.env.example` 為 `.env`
   - 在 `.env` 中填入您的 Leonardo AI API 金鑰：
```env
# Leonardo AI API Key
LEONARDO_API_KEY=your_api_key_here

# 服務器設定
PORT=3031

# 環境設定
NODE_ENV=development
LOG_LEVEL=info
```

4. 啟動服務：
```bash
start-services.bat
```

服務啟動後：
- 後端 API 服務運行於：http://localhost:3031
- 前端界面運行於：http://localhost:3001

## API 端點

### 獲取模型列表
```
GET /api/models
```

### 生成圖片
```
POST /api/generate
Content-Type: application/json

{
  "prompt": "圖片描述",
  "modelId": "模型ID",
  "numImages": 1
}
```

### 獲取生成記錄
```
GET /api/generations
```

### 獲取特定生成結果
```
GET /api/generations/:id
```

## 目錄結構

```
├── logs/                # 日誌文件
├── src/
│   ├── client/         # React 前端應用
│   ├── server/         # Express 後端服務
│   ├── services/       # 業務邏輯服務
│   └── utils/          # 工具函數
├── .env                # 環境變數配置
├── .env.example        # 環境變數範例
├── package.json        # 專案配置
└── start-services.bat  # 啟動腳本
```

## 注意事項

1. 請確保您有有效的 Leonardo AI API 金鑰
   - 訪問 https://leonardo.ai/
   - 登入您的帳戶
   - 在設置中獲取 API 金鑰

2. 如果服務無法啟動，請檢查：
   - 端口 3031 和 3001 是否被占用
   - 環境變數是否正確設置
   - API 金鑰是否有效

3. 日誌文件位於 `logs` 目錄下，可用於排查問題

## 授權

MIT License
