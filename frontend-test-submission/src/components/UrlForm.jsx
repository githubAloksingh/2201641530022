import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
  Grid,
  Divider
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { validateUrlEntry } from '../utils/validation';
import { ensureUniqueShortcode } from '../utils/shortcode';
import { getExistingShortcodes, addUrlsToStorage } from '../utils/persistence';
import { useLogging } from '../hooks/useLogging';

const UrlForm = ({ onSubmit }) => {
  const { logInfo, logError } = useLogging();
  const [entries, setEntries] = useState([
    { originalUrl: '', validity: '', preferredShortcode: '' }
  ]);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const addEntry = () => {
    if (entries.length < 5) {
      setEntries([...entries, { originalUrl: '', validity: '', preferredShortcode: '' }]);
      logInfo('URL entry row added', { totalRows: entries.length + 1 });
    }
  };

  const removeEntry = (index) => {
    if (entries.length > 1) {
      const newEntries = entries.filter((_, i) => i !== index);
      setEntries(newEntries);
      logInfo('URL entry row removed', { totalRows: newEntries.length });
    }
  };

  const updateEntry = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);

    // Clear error for this field
    if (errors[index]) {
      const newErrors = { ...errors };
      if (newErrors[index][field]) {
        delete newErrors[index][field];
        if (Object.keys(newErrors[index]).length === 0) {
          delete newErrors[index];
        }
        setErrors(newErrors);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setErrors({});

    try {
      logInfo('Form submission started', { entriesCount: entries.length });

      // Validate all entries
      const validationResults = entries.map(validateUrlEntry);
      const hasErrors = validationResults.some(result => !result.isValid);

      if (hasErrors) {
        const newErrors = {};
        validationResults.forEach((result, index) => {
          if (!result.isValid) {
            newErrors[index] = result.errors;
          }
        });
        setErrors(newErrors);
        logError('Form validation failed', { errors: newErrors });
        return;
      }

      // Check for duplicate preferred shortcodes within the form
      const preferredShortcodes = entries
        .map(entry => entry.preferredShortcode)
        .filter(Boolean);
      
      const duplicates = preferredShortcodes.filter((code, index, arr) => 
        arr.indexOf(code) !== index
      );

      if (duplicates.length > 0) {
        setAlert({
          severity: 'error',
          message: `Duplicate shortcodes in form: ${duplicates.join(', ')}`
        });
        logError('Duplicate shortcodes in form', { duplicates });
        return;
      }

      // Check against existing shortcodes
      const existingShortcodes = getExistingShortcodes();
      const urlsToCreate = [];

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        try {
          const shortcode = ensureUniqueShortcode(
            entry.preferredShortcode, 
            [...existingShortcodes, ...urlsToCreate.map(u => u.shortcode)]
          );
          
          const validity = entry.validity ? parseInt(entry.validity, 10) : 30;
          const createdAt = new Date();
          const expiryAt = new Date(createdAt.getTime() + validity * 60 * 1000);

          urlsToCreate.push({
            shortcode,
            originalUrl: entry.originalUrl.trim(),
            createdAt: createdAt.toISOString(),
            expiryAt: expiryAt.toISOString(),
            clicks: 0,
            clickDetails: []
          });
        } catch (error) {
          setAlert({
            severity: 'error',
            message: error.message
          });
          logError('Shortcode uniqueness check failed', { error: error.message, entry });
          return;
        }
      }

      // Save to storage
      addUrlsToStorage(urlsToCreate);
      
      logInfo('URLs created successfully', { 
        count: urlsToCreate.length,
        shortcodes: urlsToCreate.map(u => u.shortcode)
      });

      // Reset form
      setEntries([{ originalUrl: '', validity: '', preferredShortcode: '' }]);
      setAlert({
        severity: 'success',
        message: `Successfully created ${urlsToCreate.length} short link${urlsToCreate.length > 1 ? 's' : ''}`
      });

      if (onSubmit) {
        onSubmit(urlsToCreate);
      }

    } catch (error) {
      logError('Unexpected error during form submission', { error: error.message });
      setAlert({
        severity: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create Short Links
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add up to 5 URLs to shorten at once. Set custom expiry times and preferred shortcodes.
      </Typography>

      {alert && (
        <Alert severity={alert.severity} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {entries.map((entry, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            {index > 0 && <Divider sx={{ mb: 2 }} />}
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Original URL *"
                  value={entry.originalUrl}
                  onChange={(e) => updateEntry(index, 'originalUrl', e.target.value)}
                  error={!!errors[index]?.originalUrl}
                  helperText={errors[index]?.originalUrl}
                  placeholder="https://example.com"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Validity (minutes)"
                  type="number"
                  value={entry.validity}
                  onChange={(e) => updateEntry(index, 'validity', e.target.value)}
                  error={!!errors[index]?.validity}
                  helperText={errors[index]?.validity || 'Default: 30'}
                  placeholder="30"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Preferred Shortcode"
                  value={entry.preferredShortcode}
                  onChange={(e) => updateEntry(index, 'preferredShortcode', e.target.value)}
                  error={!!errors[index]?.preferredShortcode}
                  helperText={errors[index]?.preferredShortcode || 'Alphanumeric only'}
                  placeholder="mylink"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', gap: 1, height: '56px', alignItems: 'center' }}>
                  {entries.length > 1 && (
                    <IconButton
                      onClick={() => removeEntry(index)}
                      color="error"
                      size="large"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                  {index === entries.length - 1 && entries.length < 5 && (
                    <IconButton
                      onClick={addEntry}
                      color="primary"
                      size="large"
                    >
                      <AddIcon />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {entries.length} of 5 URLs
          </Typography>
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            disabled={entries.every(entry => !entry.originalUrl.trim())}
          >
            Create Short Links
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default UrlForm;