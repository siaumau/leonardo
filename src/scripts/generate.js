const axios = require('axios');
const dotenv = require('dotenv');
const { logger } = require('../utils/logger');

dotenv.config();

async function generateImage(prompt, modelId) {
  try {
    const response = await axios.post('http://localhost:3000/api/generate', {
      prompt,
      modelId,
      numImages: 1
    }, {
      headers: {
        'X-API-Key': process.env.LOCAL_API_KEY
      }
    });

    logger.info('圖片生成成功', { generationId: response.data.id });
    console.log('生成結果：', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    logger.error('圖片生成失敗', { error: error.message });
    console.error('錯誤：', error.message);
    process.exit(1);
  }
}

// 從命令行參數獲取 prompt 和 modelId
const [,, prompt, modelId] = process.argv;
if (!prompt) {
  console.error('請提供圖片描述');
  process.exit(1);
}

generateImage(prompt, modelId || process.env.DEFAULT_MODEL_ID);
