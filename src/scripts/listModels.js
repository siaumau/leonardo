const axios = require('axios');
const dotenv = require('dotenv');
const { logger } = require('../utils/logger');

dotenv.config();

async function listModels() {
  try {
    const response = await axios.get('http://localhost:3000/api/models', {
      headers: {
        'X-API-Key': process.env.LOCAL_API_KEY
      }
    });

    logger.info('成功獲取模型列表');
    console.log('可用模型：');
    response.data.forEach(model => {
      console.log(`- ${model.name} (ID: ${model.id})`);
    });
  } catch (error) {
    logger.error('獲取模型列表失敗', { error: error.message });
    console.error('錯誤：', error.message);
    process.exit(1);
  }
}

listModels();
