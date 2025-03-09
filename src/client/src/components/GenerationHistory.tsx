import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Image,
  Text,
  SimpleGrid,
  useToast
} from '@chakra-ui/react';

const GenerationHistory: React.FC = () => {
  const [history, setHistory] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/generations`, {
        headers: {
          'X-API-Key': process.env.REACT_APP_LOCAL_API_KEY
        }
      });
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      toast({
        title: '錯誤',
        description: '無法載入生成記錄',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box w="full">
      <Heading size="md" mb={4}>生成記錄</Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {history.map((item) => (
          <Box
            key={item.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
          >
            <Image src={item.imageUrl} alt={item.prompt} />
            <Box p={4}>
              <Text fontSize="sm" color="gray.500">
                {new Date(item.createdAt).toLocaleString()}
              </Text>
              <Text noOfLines={2}>{item.prompt}</Text>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default GenerationHistory;
