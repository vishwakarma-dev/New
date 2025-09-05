import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Slider,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Security,
  Notifications,
  Palette,
  Language,
  Storage,
  Delete,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { updateSetting } from '../store/userSettingsSlice';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const settings = useSelector((s: RootState) => s.userSettings);

  const [editing, setEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'editor' | 'notifications' | 'security'>('appearance');

  // User profile data
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Frontend developer and designer passionate about creating beautiful user experiences.',
    website: 'https://example.com',
    location: 'San Francisco, CA',
    avatar: user?.avatar || '',
  });


  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPasswords: false,
  });

  const handleProfileSave = () => {
    // Here you would typically save to your backend
    setEditing(false);
    setShowSuccessMessage(true);
  };

  const handleSettingChange = (key: any, value: any) => {
    dispatch(updateSetting({ key, value }));
    setShowSuccessMessage(true);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    // Reset form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      showPasswords: false,
    });
    setShowSuccessMessage(true);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, avatar: url }));
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (confirmed) {
      logout();
      navigate('/');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Tooltip title="Back to Dashboard">
            <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Account
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 2, px: 1, maxWidth: '1200px' }}>
        <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
          {/* Profile Section */}
          <Grid size={{ xs:12, md:4 }} >
            <Box sx={{ position: { md: 'sticky' }, top: { md: 16 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card sx={{ borderRadius: '16px', boxShadow: '0px 4px 20px rgba(0,0,0,0.08)', border: '1.25px solid rgba(0,0,0,0.05)', overflow: 'hidden', transition: 'box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ textAlign: 'center', p: 2, alignItems: 'center', alignSelf: 'stretch', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                  <Avatar
                    src={profile.avatar}
                    alt={profile.name}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  />
                  {editing && (
                    <Box sx={{ position: 'absolute', bottom: 8, right: 8 }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        style={{ display: 'none' }}
                        id="avatar-upload"
                      />
                      <label htmlFor="avatar-upload">
                        <IconButton component="span" size="small" sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                          <PhotoCamera fontSize="small" />
                        </IconButton>
                      </label>
                    </Box>
                  )}
                </Box>
                
                {editing ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb:2 }}>
                    <TextField
                      label="Name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      size="small"
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      size="small"
                      fullWidth
                    />
                    <TextField
                      label="Bio"
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      multiline
                      rows={3}
                      size="small"
                      fullWidth
                    />
                    <TextField
                      label="Website"
                      value={profile.website}
                      onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                      size="small"
                      fullWidth
                    />
                    <TextField
                      label="Location"
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      size="small"
                      fullWidth
                    />
                  </Box>
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {profile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {profile.email}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {profile.bio}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📍 {profile.location}
                    </Typography>
                    <Typography variant="body2" color="primary.main" sx={{ mt: 1 }}>
                      🌐 {profile.website}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  {editing ? (
                    <>
                      <Button variant="contained" startIcon={<Save />} onClick={handleProfileSave}>
                        Save
                      </Button>
                      <Button variant="outlined" startIcon={<Cancel />} onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant="outlined" startIcon={<Edit />} onClick={() => setEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Account Statistics</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Projects Created</Typography>
                  <Chip label="12" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Templates Used</Typography>
                  <Chip label="8" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Storage Used</Typography>
                  <Chip label="2.4 GB" size="small" color="primary" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Member Since</Typography>
                  <Chip label="Jan 2024" size="small" />
                </Box>
              </CardContent>
            </Card>
            </Box>
          </Grid>

          {/* Settings Sections */}
          <Grid size={{ xs:12, md:8 }} >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Card>
                <Tabs
                  value={activeTab}
                  onChange={(_, v) => setActiveTab(v)}
                  variant="fullWidth"
                  sx={{
                    "& .MuiTab-root": { minHeight: 56, fontWeight: 400 },
                  }}
                >
                  <Tab icon={<Palette />} iconPosition="start" value="appearance" label="Appearance" />
                  <Tab icon={<Edit />} iconPosition="start" value="editor" label="Editor" />
                  <Tab icon={<Notifications />} iconPosition="start" value="notifications" label="Notifications" />
                  <Tab icon={<Security />} iconPosition="start" value="security" label="Security" />
                </Tabs>
              </Card>

              {activeTab === 'appearance' && (
                <Card variant='outlined' sx={{padding : 2}}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Palette sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6">Appearance</Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid size={{ xs:12, sm:6 }} >
                        <FormControl fullWidth size="small">
                          <InputLabel>Theme</InputLabel>
                          <Select
                            value={settings.theme}
                            label="Theme"
                            onChange={(e) => handleSettingChange('theme', e.target.value)}
                          >
                            <MenuItem value="light">Light</MenuItem>
                            <MenuItem value="dark">Dark</MenuItem>
                            <MenuItem value="auto">Auto</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs:12, sm:6 }} >
                        <FormControl fullWidth size="small">
                          <InputLabel>Language</InputLabel>
                          <Select
                            value={settings.language}
                            label="Language"
                            onChange={(e) => handleSettingChange('language', e.target.value)}
                          >
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="es">Spanish</MenuItem>
                            <MenuItem value="fr">French</MenuItem>
                            <MenuItem value="de">German</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="overline" color="text.secondary" display="block" mb={1}>Global Theme Presets</Typography>
                      <Grid container spacing={2}>
                        {[{ name: 'Default MUI', p: '#1976d2', s: '#dc004e' }, { name: 'Indigo Purple', p: '#667eea', s: '#764ba2' }, { name: 'Ocean Blue', p: '#0077b6', s: '#00b4d8' }, { name: 'Forest Green', p: '#2d6a4f', s: '#40916c' }, { name: 'Sunset Orange', p: '#e55934', s: '#fa7921' }, { name: 'Royal Purple', p: '#44355B', s: '#6A5693' }, { name: 'Graphite', p: '#212529', s: '#6c757d' }, { name: 'Teal & Coral', p: '#008080', s: '#FF7F50' }, { name: 'Rose Gold', p: '#B76E79', s: '#D6AD60' }].map(preset => {
                          const isActive = settings.primaryColor === preset.p && settings.secondaryColor === preset.s;
                          return (
                          <Grid key={preset.name} size={{ xs:12, sm:6, md:4 }} >
                            <Card variant="outlined" onClick={() => { handleSettingChange('primaryColor', preset.p); handleSettingChange('secondaryColor', preset.s); }} sx={{ cursor: 'pointer', position: 'relative', borderColor: isActive ? 'primary.main' : 'divider', borderWidth: isActive ? 2 : 1 }}>
                              <CardContent>
                                <Typography variant="subtitle2" gutterBottom>{preset.name}</Typography>
                                <Box display="flex" height={36} borderRadius={1} overflow="hidden">
                                  <Box flex={1} bgcolor={preset.p} />
                                  <Box flex={1} bgcolor={preset.s} />
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                          );
                        })}
                      </Grid>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Global Font Family</InputLabel>
                        <Select value={settings.fontFamily || 'Inter, Roboto, Helvetica, Arial, sans-serif'} label="Global Font Family" onChange={(e) => handleSettingChange('fontFamily', e.target.value)}>
                          {['Inter, Roboto, Helvetica, Arial, sans-serif','Roboto, sans-serif','Poppins, sans-serif','Lato, sans-serif','Arial, sans-serif','Verdana, sans-serif','Georgia, serif','Times New Roman, serif','Courier New, monospace'].map(f => (
                            <MenuItem key={f} value={f} sx={{ fontFamily: f }}>{f.split(',')[0]}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="overline" color="text.secondary" display="block" mb={1}>Global Shape & Spacing</Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs:12, sm:6 }} >
                          <Typography gutterBottom variant="body2">Border Radius</Typography>
                          <Slider value={settings.borderRadius ?? 12} onChange={(_, v) => handleSettingChange('borderRadius', v as number)} step={2} marks min={0} max={24} valueLabelDisplay="auto" />
                        </Grid>
                        <Grid size={{ xs:12, sm:6 }} >
                          <Typography gutterBottom variant="body2">Global Spacing Unit (px)</Typography>
                          <Slider value={settings.spacingUnit ?? 8} onChange={(_, v) => handleSettingChange('spacingUnit', v as number)} step={1} marks min={4} max={16} valueLabelDisplay="auto" />
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'editor' && (
                <Card variant='outlined' sx={{padding : 2}}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Edit sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6">Editor Preferences</Typography>
                    </Box>

                    <List dense>
                      <ListItem>
                        <ListItemText primary="Auto Save" secondary="Automatically save changes" />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.autoSave}
                            onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Grid Snapping" secondary="Snap elements to grid" />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.gridSnapping}
                            onChange={(e) => handleSettingChange('gridSnapping', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Show Rulers" secondary="Display rulers in canvas" />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.showRulers}
                            onChange={(e) => handleSettingChange('showRulers', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>

                    <FormControl size="small" sx={{ mt: 2, minWidth: 120 }}>
                      <InputLabel>Default Unit</InputLabel>
                      <Select
                        value={settings.defaultUnit}
                        label="Default Unit"
                        onChange={(e) => handleSettingChange('defaultUnit', e.target.value)}
                      >
                        <MenuItem value="px">Pixels (px)</MenuItem>
                        <MenuItem value="rem">REM</MenuItem>
                        <MenuItem value="%">Percentage (%)</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card variant='outlined' sx={{padding : 2}}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Notifications sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6">Notifications</Typography>
                    </Box>

                    <List dense>
                      <ListItem>
                        <ListItemText primary="Email Notifications" secondary="Receive updates via email" />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.emailNotifications}
                            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Push Notifications" secondary="Receive browser notifications" />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.pushNotifications}
                            onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'security' && (
              <Box gap={2}>

                <Box display="flex" flexDirection="column" gap={2}>
                  <Card variant='outlined' sx={{padding : 2}}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Security sx={{ mr: 2, color: 'primary.main' }} />
                        <Typography variant="h6">Security</Typography>
                      </Box>

                      <Typography variant="subtitle2" gutterBottom>Change Password</Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs:12 }} >
                          <TextField
                            type={passwordData.showPasswords ? 'text' : 'password'}
                            label="Current Password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            size="small"
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <IconButton
                                  onClick={() => setPasswordData(prev => ({ ...prev, showPasswords: !prev.showPasswords }))}
                                  edge="end"
                                >
                                  {passwordData.showPasswords ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs:12, sm:6 }} >
                          <TextField
                            type={passwordData.showPasswords ? 'text' : 'password'}
                            label="New Password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid size={{ xs:12, sm:6 }} >
                          <TextField
                            type={passwordData.showPasswords ? 'text' : 'password'}
                            label="Confirm Password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid size={{ xs:12 }} >
                          <Button
                            variant="outlined"
                            onClick={handlePasswordChange}
                            disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                          >
                            Change Password
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Danger Zone */}
                  <Card variant='outlined' sx={{ border: '1px solid', borderColor: 'error.main', padding: 2 }}>
                    <CardContent>
                      <Typography variant="h6" color="error.main" gutterBottom>
                        Danger Zone
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Once you delete your account, there is no going back. Please be certain.
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Success Message */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSuccessMessage(false)}>
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;
