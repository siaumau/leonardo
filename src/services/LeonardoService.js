const axios = require('axios');
const { logger } = require('../utils/logger');

class LeonardoService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://cloud.leonardo.ai/api/rest/v1';
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // 添加請求攔截器，用於日誌記錄
    this.axiosInstance.interceptors.request.use(
      (config) => {
        logger.info('發送請求', {
          method: config.method.toUpperCase(),
          url: config.url,
          headers: config.headers
        });
        return config;
      },
      (error) => {
        logger.error('請求錯誤', { error: error.message });
        return Promise.reject(error);
      }
    );

    // 添加響應攔截器，用於日誌記錄
    this.axiosInstance.interceptors.response.use(
      (response) => {
        logger.info('收到響應', {
          status: response.status,
          data: response.data
        });
        return response;
      },
      (error) => {
        if (error.response) {
          logger.error('API 錯誤響應', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
          });
        } else if (error.request) {
          logger.error('未收到響應', { request: error.request });
        } else {
          logger.error('請求配置錯誤', { error: error.message });
        }
        return Promise.reject(error);
      }
    );
  }

  async generateImages(prompt, modelId, numImages = 1) {
    try {
      const response = await this.axiosInstance.post('/generations', {
        prompt,
        modelId,
        num_images: numImages,
        width: 512,
        height: 512
      });

      logger.info('圖片生成請求已發送', {
        generationId: response.data.sdGenerationJob.generationId
      });

      // 等待生成完成
      const result = await this.waitForGeneration(response.data.sdGenerationJob.generationId);
      return result;
    } catch (error) {
      logger.error('生成圖片失敗', { error: error.message });
      throw new Error(`生成圖片失敗: ${error.message}`);
    }
  }

  async waitForGeneration(generationId, maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      const result = await this.getGenerationById(generationId);
      if (result.status === 'COMPLETE') {
        return result;
      } else if (result.status === 'FAILED') {
        throw new Error('圖片生成失敗');
      }

      // 等待 2 秒後再次檢查
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    throw new Error('生成超時');
  }

  async getGenerationById(generationId) {
    try {
      const response = await this.axiosInstance.get(`/generations/${generationId}`);
      return response.data;
    } catch (error) {
      logger.error('獲取生成結果失敗', { error: error.message });
      throw new Error(`獲取生成結果失敗: ${error.message}`);
    }
  }

  async getModels() {
    try {
      logger.info('開始獲取模型列表');
      const response = await this.axiosInstance.get('/platformModels');

      if (!response.data) {
        logger.warn('API 響應中沒有數據');
        return [];
      }

      if (!response.data.models) {
        logger.warn('API 響應中沒有 models 字段', { data: response.data });
        return [];
      }

      logger.info('成功獲取模型列表', {
        modelCount: response.data.models.length,
        firstModel: response.data.models[0]
      });

      return response.data.models;
    } catch (error) {
      logger.error('獲取模型列表失敗', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(`獲取模型列表失敗: ${error.message}`);
    }
  }

  async getGenerations(limit = 10) {
    try {
      const response = await this.axiosInstance.get('/generations/user', {
        params: { limit }
      });
      return response.data.generations;
    } catch (error) {
      logger.error('獲取生成記錄失敗', { error: error.message });
      throw new Error(`獲取生成記錄失敗: ${error.message}`);
    }
  }
}

module.exports = { LeonardoService };
