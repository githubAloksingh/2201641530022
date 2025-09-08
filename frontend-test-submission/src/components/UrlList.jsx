import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Link,
  Alert
} from '@mui/material';
import { 
  ContentCopy as CopyIcon, 
  Launch as LaunchIcon,
  Schedule as ScheduleIcon 
} from '@mui/icons-material';
import { useLogging } from '../hooks/useLogging';
import { isExpired } from '../utils/persistence';

const UrlList = ({ urls }) => {
  const { logInfo } = useLogging();

  const copyToClipboard = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      logInfo('Short URL copied to clipboard', { shortUrl });
    });
  };

  const getShortUrl = (shortcode) => {
    return `${window.location.origin}/${shortcode}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!urls || urls.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No short links created yet. Use the form above to create your first short link!
      </Alert>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Recently Created Links
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        {urls.map((url) => {
          const shortUrl = getShortUrl(url.shortcode);
          const expired = isExpired(url);
          
          return (
            <Card 
              key={url.shortcode} 
              variant="outlined"
              sx={{ 
                borderColor: expired ? 'error.main' : 'divider',
                backgroundColor: expired ? 'error.light' : 'background.paper'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>
                      {url.shortcode}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        wordBreak: 'break-all',
                        mb: 1
                      }}
                    >
                      <strong>Original:</strong> {url.originalUrl}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Short URL:</strong>{' '}
                      <Link href={shortUrl} target="_blank" rel="noopener">
                        {shortUrl}
                      </Link>
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                    <Tooltip title="Copy short URL">
                      <IconButton size="small" onClick={() => copyToClipboard(shortUrl)}>
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Open original URL">
                      <IconButton size="small" component="a" href={url.originalUrl} target="_blank">
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Chip
                    icon={<ScheduleIcon />}
                    label={expired ? 'Expired' : 'Active'}
                    color={expired ? 'error' : 'success'}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Created: {formatDate(url.createdAt)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Expires: {formatDate(url.expiryAt)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Clicks: {url.clicks}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Paper>
  );
};

export default UrlList;