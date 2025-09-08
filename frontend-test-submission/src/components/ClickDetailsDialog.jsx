import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ClickDetailsDialog = ({ open, onClose, url }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!url) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">
            Click Details for /{url.shortcode}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {url.originalUrl}
          </Typography>
        </Box>
        <Chip label={`${url.clicks} Total Clicks`} color="primary" />
      </DialogTitle>

      <DialogContent>
        {url.clickDetails && url.clickDetails.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Timestamp</strong></TableCell>
                  <TableCell><strong>Source</strong></TableCell>
                  <TableCell><strong>Location (Coarse Geo)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {url.clickDetails.map((click, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2">
                        {formatTimestamp(click.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {click.source || 'Direct'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {click.coarseGeo || 'Unknown'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No click data available yet.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} startIcon={<CloseIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClickDetailsDialog;