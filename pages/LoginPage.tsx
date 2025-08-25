import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  Stack,
  Avatar,
  Chip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  AutoAwesome,
  Web,
  Palette
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { user, login, isLoading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLocalLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials. Use demo@example.com with any password (4+ chars)');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setError('');
    setLocalLoading(true);
    
    try {
      await login(demoEmail, 'demo123');
    } catch (err) {
      setError('Demo login failed. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 480,
          position: 'relative'
        }}
      >
        {/* Floating elements for visual appeal */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            left: -20,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            right: -30,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            animation: 'float 8s ease-in-out infinite reverse'
          }}
        />

        <Card
          elevation={24}
          sx={{
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 4,
            overflow: 'visible'
          }}
        >
          <CardContent sx={{ p: 6 }}>
            {/* Logo/Brand Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  fontSize: '2rem'
                }}
              >
                <Web />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                WebBuilder
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create stunning websites with AI-powered tools
              </Typography>
            </Box>

            {/* Demo Login Options */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Quick Demo Login:
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                <Chip
                  label="John Doe"
                  onClick={() => handleDemoLogin('demo@example.com')}
                  clickable
                  variant="outlined"
                  size="small"
                  disabled={localLoading || isLoading}
                />
                <Chip
                  label="Jane Smith"
                  onClick={() => handleDemoLogin('jane@example.com')}
                  clickable
                  variant="outlined"
                  size="small"
                  disabled={localLoading || isLoading}
                />
              </Stack>
            </Box>

            <Divider sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary">
                or sign in manually
              </Typography>
            </Divider>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 3 }}
                disabled={localLoading || isLoading}
                placeholder="demo@example.com"
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 4 }}
                disabled={localLoading || isLoading}
                placeholder="Enter any password (4+ characters)"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={localLoading || isLoading}
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                  }
                }}
              >
                {localLoading || isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>

            {/* Features Preview */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                What you'll get:
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <AutoAwesome color="primary" />
                  <Typography variant="caption" display="block">
                    AI Builder
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Palette color="primary" />
                  <Typography variant="caption" display="block">
                    Custom Themes
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Web color="primary" />
                  <Typography variant="caption" display="block">
                    Drag & Drop
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* CSS Animation Keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default LoginPage;
