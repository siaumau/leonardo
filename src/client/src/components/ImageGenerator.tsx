import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  Image,
  useToast,
  Spinner
} from '@chakra-ui/react';

interface ImageGeneratorProps {
  selectedModel: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ selectedModel }) => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const toast = useToast();

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: '錯誤',
        description: '請輸入圖片描述',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.REACT_APP_LOCAL_API_KEY
        },
        body: JSON.stringify({
          prompt,
          modelId: selectedModel,
          numImages: 1
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setGeneratedImage(data.imageUrl);
      toast({
        title: '成功',
        description: '圖片生成完成',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: '錯誤',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <VStack spacing={4} w="full">
      <FormControl>
        <FormLabel>圖片描述</FormLabel>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="請輸入您想要生成的圖片描述..."
          size="lg"
        />
      </FormControl>

      <Button
        colorScheme="blue"
        onClick={handleGenerate}
        isLoading={generating}
        loadingText="生成中..."
        w="full"
      >
        生成圖片
      </Button>

      {generatedImage && (
        <Box boxShadow="lg" p={4} rounded="md" bg="white">
          <Image src={generatedImage} alt="生成的圖片" />
        </Box>
      )}
    </VStack>
  );
};

export default ImageGenerator;
