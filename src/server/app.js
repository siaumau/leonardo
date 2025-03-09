const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { logger } = require('../utils/logger');
const { LeonardoService } = require('../services/LeonardoService');
const { authMiddleware } = require('./middleware/auth');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 中間件設置
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3031'],
  credentials: true
}));

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'Leonardo AI API 服務正常運行' });
});

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// API 金鑰驗證
app.use('/api/', authMiddleware);

const leonardoService = new LeonardoService(process.env.LEONARDO_API_KEY);

// 測試路由
app.get('/api/test', (req, res) => {
  res.json({ message: 'API 服務正常運行' });
});

// API 路由
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, modelId, numImages } = req.body;
    const result = await leonardoService.generateImages(prompt, modelId, numImages);
    logger.info('圖片生成請求成功', { generationId: result.id });
    res.json(result);
  } catch (error) {
    logger.error('圖片生成失敗', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/generations/:id', async (req, res) => {
  try {
    const result = await leonardoService.getGenerationById(req.params.id);
    res.json(result);
  } catch (error) {
    logger.error('獲取生成結果失敗', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/models', async (req, res) => {
  try {
    const response = await leonardoService.axiosInstance.get('/platformModels');
    logger.info('成功獲取模型列表', {
      modelCount: response.data?.models?.length || 0
    });
    res.json(response.data);
  } catch (error) {
    logger.error('獲取模型列表失敗', {
      error: error.message,
      response: error.response?.data
    });
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/generations', async (req, res) => {
  try {
    const generations = await leonardoService.getGenerations();
    res.json(generations);
  } catch (error) {
    logger.error('獲取生成記錄失敗', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  logger.error('服務器錯誤', { error: err.message });
  res.status(500).json({ error: '服務器內部錯誤' });
});

// 優化的啟動處理
const startServer = async () => {
  try {
    await new Promise((resolve, reject) => {
      const server = app.listen(port, () => {
        logger.info(`API 服務運行於 http://localhost:${port}`);
        console.log(`API 服務運行於 http://localhost:${port}`);
        resolve();
      });

      server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          logger.error(`端口 ${port} 已被占用`);
          console.error(`錯誤：端口 ${port} 已被占用，請先關閉占用該端口的程序`);
          process.exit(1);
        } else {
          reject(error);
        }
      });
    });
  } catch (error) {
    logger.error('服務啟動失敗', { error: error.message });
    console.error('服務啟動失敗:', error.message);
    process.exit(1);
  }
};

startServer();
