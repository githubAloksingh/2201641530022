import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import UrlStats from '../components/UrlStats';
import { loadUrlsFromStorage } from '../utils/persistence';
import { useLogging } from '../hooks/useLogging';

const StatsPage = () => {
  const { logInfo } = useLogging();
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    logInfo('StatsPage loaded');
    const loadedUrls = loadUrlsFromStorage();
    setUrls(loadedUrls);
    logInfo('URLs loaded from storage', { count: loadedUrls.length });
  }, [logInfo]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Statistics & Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor the performance of all your shortened URLs with detailed click analytics.
        </Typography>
      </Box>

      <UrlStats urls={urls} />
    </Container>
  );
};

export default StatsPage;