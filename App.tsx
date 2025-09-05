import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProjectsDashboard from './pages/ProjectsDashboard';
import EditorPage from './pages/EditorPage';
import PreviewPage from './pages/PreviewPage';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  const user = useSelector((s: RootState) => s.userSettings);
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const mode = user.theme === 'auto' ? (prefersDark ? 'dark' : 'light') : user.theme;
  const theme = createTheme({
    palette: {
      mode: mode as any,
      primary: { main: user.primaryColor || '#667eea' },
      secondary: { main: user.secondaryColor || '#764ba2' },
      background: { default: '#f8fafc', paper: '#ffffff' },
    },
    typography: {
      fontFamily: user.fontFamily || '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
          contained: {
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            '&:hover': { boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 16, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', border: '1px solid rgba(0, 0, 0, 0.05)' },
        },
      },
      MuiTextField: {
        styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 8 } } },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ProjectsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor/:projectId"
              element={
                <ProtectedRoute>
                  <EditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preview/:projectId/:pageId"
              element={
                <ProtectedRoute>
                  <PreviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
