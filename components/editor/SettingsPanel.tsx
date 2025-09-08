import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    TextField, 
    Paper, 
    Button,
    Chip,
    Stack,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import { Add, Delete, Upload, Image, ExpandMore } from '@mui/icons-material';

const SettingsPanel: React.FC = () => {
    const [expanded, setExpanded] = useState<string | false>('panel1');
    const [appSettings, setAppSettings] = useState({
        appName: 'My App',
        description: 'A beautiful web application',
        favicon: '/favicon.ico',
        owner: 'John Doe',
        tags: ['react', 'website'],
        version: '1.0.0',
        language: 'en',
        theme: 'light'
    });
    const [newTag, setNewTag] = useState('');

    const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    // Save logic
    const handleSaveWithUpdatedSettings = (updatedSettings: typeof appSettings) => {
        console.log("Saving settings...", updatedSettings);
        // Implement your API call or localStorage logic here
    };

    const handleInputChange = (field: keyof typeof appSettings, value: string) => {
        setAppSettings(prev => {
            const updated = {
                ...prev,
                [field]: value
            };
            handleSaveWithUpdatedSettings(updated);
            return updated;
        });
    };

    const handleAddTag = () => {
        if (newTag.trim() && !appSettings.tags.includes(newTag.trim())) {
            setAppSettings(prev => {
                const updated = {
                    ...prev,
                    tags: [...prev.tags, newTag.trim()]
                };
                handleSaveWithUpdatedSettings(updated);
                return updated;
            });
            setNewTag('');
        }
    };

    const handleDeleteTag = (tagToDelete: string) => {
        setAppSettings(prev => {
            const updated = {
                ...prev,
                tags: prev.tags.filter(tag => tag !== tagToDelete)
            };
            handleSaveWithUpdatedSettings(updated);
            return updated;
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddTag();
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Box sx={{ p: 2, height: '100%' }}>

                    {/* App Information Accordion */}
                    <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6" color="primary">
                                App Information
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={3}>
                                <TextField
                                    label="App Name"
                                    value={appSettings.appName}
                                    onChange={(e) => handleInputChange('appName', e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                />
                                <TextField
                                    label="Description"
                                    value={appSettings.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                />
                                <TextField
                                    label="Owner"
                                    value={appSettings.owner}
                                    onChange={(e) => handleInputChange('owner', e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                />
                                <TextField
                                    label="Version"
                                    value={appSettings.version}
                                    onChange={(e) => handleInputChange('version', e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Language</InputLabel>
                                    <Select
                                        value={appSettings.language}
                                        label="Language"
                                        onChange={(e) => handleInputChange('language', e.target.value)}
                                    >
                                        <MenuItem value="en">English</MenuItem>
                                        <MenuItem value="es">Spanish</MenuItem>
                                        <MenuItem value="fr">French</MenuItem>
                                        <MenuItem value="de">German</MenuItem>
                                        <MenuItem value="it">Italian</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Theme</InputLabel>
                                    <Select
                                        value={appSettings.theme}
                                        label="Theme"
                                        onChange={(e) => handleInputChange('theme', e.target.value)}
                                    >
                                        <MenuItem value="light">Light</MenuItem>
                                        <MenuItem value="dark">Dark</MenuItem>
                                        <MenuItem value="auto">Auto</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>

                    {/* SEO & Metadata Accordion */}
                    <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6" color="primary">
                                SEO & Metadata
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={3}>
                                <TextField
                                    label="Meta Title"
                                    value={appSettings.appName}
                                    onChange={(e) => handleInputChange('appName', e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    helperText="The title that appears in search results and browser tabs"
                                />
                                <TextField
                                    label="Meta Description"
                                    value={appSettings.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    helperText="A brief description for search engines (max 160 characters)"
                                />
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Tags
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                        <TextField
                                            size="small"
                                            placeholder="Add a tag"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            sx={{ flex: 1 }}
                                        />
                                        <Button 
                                            variant="outlined" 
                                            onClick={handleAddTag}
                                            startIcon={<Add />}
                                            disabled={!newTag.trim()}
                                        >
                                            Add
                                        </Button>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {appSettings.tags.map((tag) => (
                                            <Chip
                                                key={tag}
                                                label={tag}
                                                onDelete={() => handleDeleteTag(tag)}
                                                deleteIcon={<Delete />}
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Box>
                                <TextField
                                    label="Canonical URL"
                                    placeholder="https://example.com"
                                    fullWidth
                                    variant="outlined"
                                    helperText="The preferred URL for this page"
                                />
                                <TextField
                                    label="Open Graph Image URL"
                                    placeholder="https://example.com/og-image.jpg"
                                    fullWidth
                                    variant="outlined"
                                    helperText="Image shown when shared on social media"
                                />
                            </Stack>
                        </AccordionDetails>
                    </Accordion>

                    {/* Assets & Branding Accordion */}
                    <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6" color="primary">
                                Assets & Branding
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={3}>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                                        Favicon
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar 
                                            src={appSettings.favicon} 
                                            sx={{ width: 32, height: 32 }}
                                            variant="rounded"
                                        >
                                            <Image />
                                        </Avatar>
                                        <TextField
                                            size="small"
                                            value={appSettings.favicon}
                                            onChange={(e) => handleInputChange('favicon', e.target.value)}
                                            sx={{ flex: 1 }}
                                            placeholder="/favicon.ico"
                                        />
                                        <IconButton color="primary">
                                            <Upload />
                                        </IconButton>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        32x32 PNG or ICO format recommended
                                    </Typography>
                                </Paper>

                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                                        App Logo
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ width: 48, height: 48 }} variant="rounded">
                                            <Image />
                                        </Avatar>
                                        <TextField
                                            size="small"
                                            placeholder="/logo.png"
                                            sx={{ flex: 1 }}
                                        />
                                        <IconButton color="primary">
                                            <Upload />
                                        </IconButton>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        SVG or PNG format, transparent background recommended
                                    </Typography>
                                </Paper>

                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                                        App Icon (PWA)
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ width: 48, height: 48 }} variant="rounded">
                                            <Image />
                                        </Avatar>
                                        <TextField
                                            size="small"
                                            placeholder="/app-icon-192.png"
                                            sx={{ flex: 1 }}
                                        />
                                        <IconButton color="primary">
                                            <Upload />
                                        </IconButton>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        192x192 and 512x512 PNG formats for PWA support
                                    </Typography>
                                </Paper>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>

                </Box>
            </Box>
        </Box>
    );
};

export default SettingsPanel;
