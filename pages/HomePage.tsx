import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Stack,
  Chip,
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  AutoAwesome,
  Web,
  Palette,
  Speed,
  PhoneIphone,
  Cloud,
  ArrowForward,
  Star,
  PlayArrow,
  GitHub,
  LinkedIn,
  Twitter
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <AutoAwesome />,
      title: 'AI-Powered Builder',
      description: 'Create websites with natural language. Just describe what you want, and our AI builds it.'
    },
    {
      icon: <Web />,
      title: 'Drag & Drop Editor',
      description: 'Intuitive visual editor with drag-and-drop components. No coding required.'
    },
    {
      icon: <Palette />,
      title: 'Custom Themes',
      description: 'Beautiful pre-designed themes and the ability to customize every aspect of your site.'
    },
    {
      icon: <Speed />,
      title: 'Lightning Fast',
      description: 'Optimized performance with modern web technologies for blazing-fast loading times.'
    },
    {
      icon: <PhoneIphone />,
      title: 'Mobile Responsive',
      description: 'All websites are automatically optimized for mobile, tablet, and desktop devices.'
    },
    {
      icon: <Cloud />,
      title: 'Cloud Hosting',
      description: 'Deploy instantly to the cloud with automatic SSL, CDN, and global distribution.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b743?w=150&h=150&fit=crop&crop=face',
      comment: 'I built my entire e-commerce site in under an hour. The AI understood exactly what I wanted!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Freelance Designer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      comment: 'This tool has revolutionized my workflow. I can prototype and deliver websites 10x faster.',
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      role: 'Marketing Manager',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      comment: 'The drag-and-drop editor is incredibly intuitive. Perfect for non-technical users like me.',
      rating: 5
    }
  ];

  return (
    <Box>
      {/* Navigation */}
      <AppBar position="fixed" sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar sx={{ mr: 2, background: 'linear-gradient(45deg, #667eea, #764ba2)' }}>
              <Web />
            </Avatar>
            <Typography variant="h6" color="primary" fontWeight="bold">
              WebBuilder
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            {user ? (
              <Button variant="contained" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button color="primary" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button variant="contained" onClick={() => navigate('/login')}>
                  Get Started
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pt: 12,
          pb: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 8s ease-in-out infinite'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '5%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            animation: 'float 6s ease-in-out infinite reverse'
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                Build Stunning Websites with AI
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Transform your ideas into beautiful, responsive websites in minutes.
                No coding skills required.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                <Chip label="🚀 AI-Powered" color="secondary" />
                <Chip label="⚡ Fast Setup" color="secondary" />
                <Chip label="📱 Mobile Ready" color="secondary" />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/login')}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  Start Building Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrow />}
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Watch Demo
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  '& img': {
                    width: '100%',
                    height: 'auto',
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
                  alt="Website Builder Interface"
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Everything You Need
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Powerful features that make website building simple, fast, and enjoyable
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 3,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      fontSize: '2rem'
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Loved by Thousands
            </Typography>
            <Typography variant="h6" color="text.secondary">
              See what our users are saying about WebBuilder
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar src={testimonial.avatar} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: 'gold', fontSize: '1.2rem' }} />
                      ))}
                    </Box>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      "{testimonial.comment}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Ready to Build Your Dream Website?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of users who've already created amazing websites with WebBuilder
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/login')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2, background: 'linear-gradient(45deg, #667eea, #764ba2)' }}>
                  <Web />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  WebBuilder
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
                The easiest way to create stunning websites with AI-powered tools and intuitive design.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton sx={{ color: 'white' }}>
                  <GitHub />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <LinkedIn />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <Twitter />
                </IconButton>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  © 2024 WebBuilder. All rights reserved.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CSS Animation */}
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

export default HomePage;
