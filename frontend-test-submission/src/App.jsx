import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Container
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Analytics as AnalyticsIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import RedirectPage from './pages/RedirectPage';
import ErrorBoundary from './components/ErrorBoundary';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default' }}>
            <AppBar position="static" elevation={1}>
              <Container maxWidth="lg">
                <Toolbar sx={{ px: 0 }}>
                  <LinkIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    URL Shortener
                  </Typography>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/"
                    startIcon={<HomeIcon />}
                    sx={{ mr: 1 }}
                  >
                    Home
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/stats"
                    startIcon={<AnalyticsIcon />}
                  >
                    Statistics
                  </Button>
                </Toolbar>
              </Container>
            </AppBar>

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/:shortcode" element={<RedirectPage />} />
            </Routes>
          </Box>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
