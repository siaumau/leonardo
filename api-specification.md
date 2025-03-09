# Leonardo AI API 代理服務規格書

## 服務概述
此服務為 Leonardo AI API 的代理服務，提供了簡化的介面來生成 AI 圖片。服務運行在內部網路，供其他設備調用使用。

## 基本資訊
- **基礎 URL**: `http://192.168.0.234:5000`
- **API 版本**: 1.0
- **內部使用**: 僅限內網設備存取

## API 端點

### 1. 健康檢查
檢查服務是否正常運作。

```http
GET /health
```

#### 回應
```json
{
    "status": "healthy"
}
```

### 2. 獲取可用模型
獲取所有可用的 AI 模型列表。

```http
GET /models
```

#### 回應
```json
{
  "custom_models": [
    {
      "description": "Leonardo's proprietary foundational model, delivering exceptional prompt adherence and text rendering.",
      "featured": false,
      "generated_image": {
        "id": "744d2b7d-c1c0-4f72-8862-70ceffe6698b",
        "url": "https://cdn.leonardo.ai/users/d35cac34-28ff-4c33-8022-ebc672a45aca/generations/a0bfc1a1-f623-4646-a090-1e41fe4c2f37/segments/2:2:2/Leonardo_Phoenix_Image_is_a_digital_artwork_featuring_a_vibran_0.jpg"
      },
      "id": "de7d3faf-762f-48e0-b3b7-9d0ac3a3fcf3",
      "name": "Leonardo Phoenix 1.0",
      "nsfw": false
    },
    {
      "description": "A specialized model built for developers. Great for rapid prototyping and creative iteration.",
      "featured": false,
      "generated_image": {
        "id": "d4e54c43-e278-48a1-8364-8b1f92307448",
        "url": "https://cdn.leonardo.ai/users/097c79c3-b0de-4183-8870-e1527a80cca4/generations/17b319bc-b996-4e3a-8c88-058928221b20/17b319bc-b996-4e3a-8c88-058928221b20.jpg"
      },
      "id": "b2614463-296c-462a-9586-aafdb8f00e36",
      "name": "Flux Dev",
      "nsfw": false
    }
    ]
}
```

### 3. 生成圖片
提交圖片生成請求。

```http
POST /generate-image
Content-Type: application/json
```

#### 請求體
```json
{
    "modelId": "16e7060a-803e-4df3-97ee-edcfa5dc9cc8",
    "prompt": "一隻可愛的小貓咪",
    "negative_prompt": "",
    "width": 512,
    "height": 512,
    "num_images": 1,
    "seed": 123,
    "public": false,
    "promptMagic": false
}
```

#### 回應
```json
{
    "full_response": {
        "generations_by_pk": {
            "createdAt": "2025-03-09T14:14:40.429",
            "fantasyAvatar": null,
            "generated_images": [
                {
                    "generated_image_variation_generics": [],
                    "id": "2e5368d8-024e-40d5-be6b-d8e1f1e02fa8",
                    "likeCount": 0,
                    "motionMP4URL": null,
                    "nsfw": true,
                    "url": "https://cdn.leonardo.ai/users/136a1751-f7eb-4c5b-b30c-efd237221638/generations/350929bd-d0c9-4730-98c0-ddf2c9b784ba/SDXL_10_0.jpg"
                }
            ],
            "generation_elements": [],
            "guidanceScale": 7,
            "id": "350929bd-d0c9-4730-98c0-ddf2c9b784ba",
            "imageHeight": 512,
            "imageToVideo": null,
            "imageWidth": 512,
            "inferenceSteps": 15,
            "initStrength": null,
            "modelId": "16e7060a-803e-4df3-97ee-edcfa5dc9cc8",
            "motion": null,
            "motionModel": null,
            "motionStrength": null,
            "negativePrompt": "",
            "photoReal": false,
            "photoRealStrength": null,
            "presetStyle": null,
            "prompt": "一個帥氣的中年亞洲男性",
            "promptMagic": false,
            "promptMagicStrength": null,
            "promptMagicVersion": null,
            "prompt_moderations": [
                {
                    "moderationClassification": []
                }
            ],
            "public": false,
            "scheduler": "EULER_DISCRETE",
            "sdVersion": "SDXL_1_0",
            "seed": 123,
            "status": "COMPLETE",
            "ultra": null
        }
    },
    "generationId": "350929bd-d0c9-4730-98c0-ddf2c9b784ba",
    "imageUrls": [
        {
            "generated_image_variation_generics": [],
            "id": "2e5368d8-024e-40d5-be6b-d8e1f1e02fa8",
            "likeCount": 0,
            "motionMP4URL": null,
            "nsfw": true,
            "url": "https://cdn.leonardo.ai/users/136a1751-f7eb-4c5b-b30c-efd237221638/generations/350929bd-d0c9-4730-98c0-ddf2c9b784ba/SDXL_10_0.jpg"
        }
    ],
    "message": "圖片生成完成",
    "status": "success"
}
```

### 4. 檢查生成狀態
檢查特定圖片生成請求的狀態。

```http
GET /generation-status/:generationId
```

#### 回應
```json
{
    "status": "COMPLETE",
    "imageUrls": [
        "https://cdn.leonardo.ai/generated-image-url.png"
    ],
    "generationId": "61b2f684-d3e1-44bb-8aa4-9e8ec554b059"
}
```

### 5. 生成圖片並等待結果（簡化版）
生成圖片並等待完成，直接返回圖片 URL。

```http
POST /generate-image-simple
Content-Type: application/json
```

#### 請求體
與 `/generate-image` 相同

#### 成功回應
```json
{
    "success": true,
    "urls": [
        "https://cdn.leonardo.ai/generated-image-url.png"
    ]
}
```

#### 失敗回應
```json
{
    "success": false,
    "error": "圖片生成失敗"
}
```

## 可用模型列表

以下是系統支援的 AI 模型列表，建議根據不同需求選擇適合的模型：

### 推薦模型

1. **Leonardo Phoenix 1.0** (de7d3faf-762f-48e0-b3b7-9d0ac3a3fcf3)
   - 特點：Leonardo 專有的基礎模型，提供卓越的提示詞準確度和文字渲染能力

2. **Leonardo Diffusion XL** (1e60896f-3c26-4296-8ecc-53e2afecc132)
   - 特點：核心 Leonardo 模型的下一階段，即使使用簡短提示詞也能產生令人驚艷的輸出

3. **Leonardo Vision XL** (5c232a9e-9061-4777-980a-ddc8e65647c6)
   - 特點：擅長寫實和攝影風格，適合較長的提示詞

4. **Leonardo Kino XL** (aa77f04e-3eec-4034-9c07-d0f619684628)
   - 特點：專注於電影風格輸出，適合寬螢幕比例，不需要負面提示詞

### 特殊用途模型

1. **Leonardo Anime XL** (e71a1c2f-4f80-4800-934f-2c68979d8cc8)
   - 特點：專門用於動漫、插畫和 CG 風格

2. **Pixel Art** (e5a291b6-3990-495a-b1fa-7bd1864510a6)
   - 特點：像素藝術風格，特別適合遊戲素材

3. **Character Portraits** (6c95de60-a0bc-4f90-b637-ee8971caf3b0)
   - 特點：創建各種 RPG 角色肖像

4. **DreamShaper v7** (ac614f96-1082-45bf-be9d-757f2d31c174)
   - 特點：多功能模型，適合各種風格

## 參數說明

### 必要參數
- `prompt`: 圖片描述文字（必填）

### 可選參數
- `modelId`: AI 模型 ID，預設使用系統設定的模型
- `negative_prompt`: 不希望在圖片中出現的元素描述
- `width`: 圖片寬度（預設 512）
- `height`: 圖片高度（預設 512）
- `num_images`: 生成圖片數量（預設 1）
- `seed`: 隨機種子（預設 0）
- `public`: 是否公開（預設 false）
- `promptMagic`: 是否使用提示詞增強（預設 false）

## 狀態代碼說明
- `PENDING`: 等待處理中
- `IN_PROGRESS`: 正在生成圖片
- `COMPLETE`: 生成完成
- `FAILED`: 生成失敗

## 錯誤處理
所有 API 在發生錯誤時會返回適當的 HTTP 狀態碼和錯誤訊息：

```json
{
    "error": "錯誤描述",
    "details": {
        "error": "詳細錯誤信息"
    }
}
```

## 使用建議
1. 建議使用 `/generate-image-simple` 端點進行簡單的圖片生成，該端點會自動等待結果
2. 如需更細緻的控制，可使用 `/generate-image` 配合 `/generation-status` 端點
3. 選擇模型時，請參考上述模型列表選擇最適合的模型
4. 提示詞（prompt）越詳細，生成的圖片質量越好

## 使用限制
1. 服務僅限內網使用
2. 圖片生成請求有 60 秒的超時限制
3. 請合理使用 API，避免過度頻繁的請求

## 聯絡支援
如有任何問題或需要協助，請聯繫系統管理員。
