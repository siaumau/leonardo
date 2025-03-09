const axios = require('axios');
const dotenv = require('dotenv');
const { logger } = require('../utils/logger');

dotenv.config();

async function viewHistory() {
  try {
    const response = await axios.get('http://localhost:3000/api/generations', {
      headers: {
        'X-API-Key': process.env.LOCAL_API_KEY
      }
    });

    logger.info('成功獲取生成記錄');
    console.log('生成記錄：');
    response.data.forEach(record => {
      console.log(`\n生成 ID: ${record.id}`);
      console.log(`提示詞: ${record.prompt}`);
      console.log(`狀態: ${record.status}`);
      console.log(`創建時間: ${new Date(record.createdAt).toLocaleString()}`);
      console.log('---');
    });
  } catch (error) {
    logger.error('獲取生成記錄失敗', { error: error.message });
    console.error('錯誤：', error.message);
    process.exit(1);
  }
}

viewHistory();
