import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';
import { useLogging } from '../hooks/useLogging';

const HomePage = () => {
  const { logInfo } = useLogging();
  const [recentUrls, setRecentUrls] = useState([]);

  useEffect(() => {
    logInfo('HomePage loaded');
  }, [logInfo]);

  const handleFormSubmit = (newUrls) => {
    setRecentUrls(newUrls);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          URL Shortener
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Create short, manageable links with custom expiry times and detailed analytics
        </Typography>
      </Box>

      <UrlForm onSubmit={handleFormSubmit} />
      
      {recentUrls.length > 0 && (
        <UrlList urls={recentUrls} />
      )}
    </Container>
  );
};

export default HomePage;
