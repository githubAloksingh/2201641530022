import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box, Alert } from '@mui/material';
import { Launch as LaunchIcon, Home as HomeIcon } from '@mui/icons-material';
import { findUrlByShortcode, updateUrlInStorage, isExpired, getCoarseGeo } from '../utils/persistence';
import { useLogging } from '../hooks/useLogging';

const RedirectPage = () => {
  const { shortcode } = useParams();
  const { logInfo, logError } = useLogging();
  const [status, setStatus] = useState('loading');
  const [url, setUrl] = useState(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        logInfo('Redirect attempt', { shortcode });

        const foundUrl = findUrlByShortcode(shortcode);

        if (!foundUrl) {
          logError('Shortcode not found', { shortcode });
          setStatus('not_found');
          return;
        }

        if (isExpired(foundUrl)) {
          logError('Link expired', { shortcode, expiryAt: foundUrl.expiryAt });
          setStatus('expired');
          setUrl(foundUrl);
          return;
        }

        // Record the click
        const clickDetail = {
          timestamp: new Date().toISOString(),
          source: document.referrer || 'Direct',
          coarseGeo: getCoarseGeo()
        };

        const updatedUrl = updateUrlInStorage(shortcode, {
          clicks: foundUrl.clicks + 1,
          clickDetails: [...foundUrl.clickDetails, clickDetail]
        });

        logInfo('Click recorded and redirecting', {
          shortcode,
          originalUrl: foundUrl.originalUrl,
          totalClicks: updatedUrl.clicks,
          clickDetail
        });

        setUrl(foundUrl);
        setStatus('redirecting');

        // Countdown and redirect
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              window.location.href = foundUrl.originalUrl;
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);

      } catch (error) {
        logError('Unexpected error during redirect', { 
          shortcode, 
          error: error.message 
        });
        setStatus('error');
      }
    };

    if (shortcode) {
      handleRedirect();
    }
  }, [shortcode, logInfo, logError]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Alert severity="info">
            Processing redirect...
          </Alert>
        );

      case 'not_found':
        return (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom color="error">
              Link Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The short link "/{shortcode}" does not exist or may have been removed.
            </Typography>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              href="/"
              size="large"
            >
              Create New Link
            </Button>
          </Paper>
        );

      case 'expired':
        return (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom color="error">
              Link Expired
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              This short link has expired and is no longer active.
            </Typography>
            {url && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Original URL: {url.originalUrl}
              </Typography>
            )}
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              href="/"
              size="large"
            >
              Create New Link
            </Button>
          </Paper>
        );

      case 'redirecting':
        return (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom color="success.main">
              Redirecting...
            </Typography>
            <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
              {countdown}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You will be redirected to:
            </Typography>
            {url && (
              <Typography 
                variant="body2" 
                sx={{ 
                  wordBreak: 'break-all',
                  backgroundColor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  mb: 3
                }}
              >
                {url.originalUrl}
              </Typography>
            )}
            <Button
              variant="outlined"
              startIcon={<LaunchIcon />}
              href={url?.originalUrl}
              target="_blank"
              size="large"
            >
              Go Now
            </Button>
          </Paper>
        );

      case 'error':
        return (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom color="error">
              Something Went Wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              An unexpected error occurred while processing your request.
            </Typography>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              href="/"
              size="large"
            >
              Go Home
            </Button>
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        {renderContent()}
      </Box>
    </Container>
  );
};

export default RedirectPage;