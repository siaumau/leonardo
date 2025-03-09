import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Container,
  useToast
} from '@chakra-ui/react';
import ImageGenerator from './components/ImageGenerator';
import ModelSelector from './components/ModelSelector';
import GenerationHistory from './components/GenerationHistory';
import { theme } from './theme';

// API 設置
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3031';

interface ModelData {
  id: string;
  name: string;
  description: string;
  featured: boolean;
  nsfw: boolean;
  generated_image?: {
    id: string;
    url: string;
  };
}

function App() {
  const toast = useToast();
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/models`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // 用於調試

      if (data && Array.isArray(data.models)) {
        console.log('找到的模型數量:', data.models.length);
        setModels(data.models);
      } else {
        console.warn('意外的數據格式:', data);
        setModels([]);
      }
    } catch (error) {
      console.error('API 錯誤:', error);
      toast({
        title: '錯誤',
        description: '無法載入模型列表',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8}>
            <Heading>Leonardo AI 圖片生成器</Heading>
            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              onSelect={setSelectedModel}
              isLoading={loading}
            />
            <ImageGenerator selectedModel={selectedModel} />
            <GenerationHistory />
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
