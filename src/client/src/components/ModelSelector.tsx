import React from 'react';
import {
  Select,
  FormControl,
  FormLabel,
  Spinner,
  Text,
  VStack,
  Box,
  Badge,
} from '@chakra-ui/react';

interface Model {
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

interface ModelSelectorProps {
  models: Model[];
  selectedModel: string;
  onSelect: (modelId: string) => void;
  isLoading?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onSelect,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <VStack spacing={4}>
        <Text>載入模型列表中...</Text>
        <Spinner />
      </VStack>
    );
  }

  if (!models || models.length === 0) {
    return <Text color="red.500">無法載入模型列表</Text>;
  }

  return (
    <FormControl>
      <FormLabel>選擇模型</FormLabel>
      <Select
        value={selectedModel}
        onChange={(e) => onSelect(e.target.value)}
        placeholder="請選擇一個模型"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} {model.featured && '⭐'}
          </option>
        ))}
      </Select>
      {selectedModel && (
        <Box mt={2} p={4} borderRadius="md" bg="gray.50">
          <Text fontWeight="bold">
            {models.find(m => m.id === selectedModel)?.name}
            {models.find(m => m.id === selectedModel)?.featured && (
              <Badge ml={2} colorScheme="yellow">精選</Badge>
            )}
          </Text>
          <Text mt={2} fontSize="sm" color="gray.600">
            {models.find(m => m.id === selectedModel)?.description}
          </Text>
        </Box>
      )}
    </FormControl>
  );
};

export default ModelSelector;
