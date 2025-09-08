import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Button,
  Box,
  Alert
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { isExpired } from '../utils/persistence';
import ClickDetailsDialog from './ClickDetailsDialog';

const UrlStats = ({ urls }) => {
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewDetails = (url) => {
    setSelectedUrl(url);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUrl(null);
  };

  if (!urls || urls.length === 0) {
    return (
      <Alert severity="info">
        No URLs have been created yet. Create your first short link to see statistics here.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        URL Statistics
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Overview of all created short links and their performance metrics.
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Shortcode</strong></TableCell>
              <TableCell><strong>Original URL</strong></TableCell>
              <TableCell><strong>Created</strong></TableCell>
              <TableCell><strong>Expires</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Clicks</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url) => {
              const expired = isExpired(url);
              const shortUrl = `${window.location.origin}/${url.shortcode}`;
              
              return (
                <TableRow key={url.shortcode}>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {url.shortcode}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        wordBreak: 'break-all',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {url.originalUrl}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(url.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(url.expiryAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={expired ? 'Expired' : 'Active'}
                      color={expired ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="bold">
                      {url.clicks}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewDetails(url)}
                      disabled={url.clicks === 0}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <ClickDetailsDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        url={selectedUrl}
      />
    </Box>
  );
};

export default UrlStats;