import React, { useState, useRef } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Divider, Menu, MenuItem, ListItemText, ListItemIcon, Tooltip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel } from '@mui/material';
import { Undo, Redo, Visibility, ArrowDropDown, Add, Edit, Delete, DesktopWindows, TabletMac, PhoneIphone, FileUpload, FileDownload, Check, GetApp, AccountCircle, Logout, Person, Share, MoreVert } from '@mui/icons-material';
import { Project, Page, ViewMode } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setViewMode, undo, redo } from '../../store/editorSlice';
import { setProjectSharing } from '../../store/projectsSlice';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import { generateReactProject } from '../../lib/projectGenerator';
import { Avatar } from '@mui/material';


interface TopBarProps {
    project: Project | undefined;
    currentPageId: string | null;
    onSwitchPage: (pageId: string) => void;
    onAddPage: (name: string) => void;
    onDeletePage: (pageId: string) => void;
    onUpdatePageName: (pageId: string, newName: string) => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onTogglePreview: () => void;
    autoSaveEnabled: boolean;
    onToggleAutoSave: (enabled: boolean) => void;
}

const TopBar: React.FC<TopBarProps> = ({ project, currentPageId, onSwitchPage, onAddPage, onDeletePage, onUpdatePageName, onImport, onTogglePreview, autoSaveEnabled, onToggleAutoSave }) => {
    const dispatch: AppDispatch = useDispatch();
    const { history, viewMode, projectId } = useSelector((state: RootState) => state.editor);
    const projectFromStore = useSelector((state: RootState) => state.projects.projects.find(p => p.id === projectId));
    const currentPage = history.present;
    const canUndo = history.past.length > 0;
    const canRedo = history.future.length > 0;
    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
    const [moreAnchorEl, setMoreAnchorEl] = useState<null | HTMLElement>(null);
    const importInputRef = useRef<HTMLInputElement>(null);
    const pageNameInputRef = useRef<HTMLInputElement>(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // State for unified Add/Edit
    const [pageNameInput, setPageNameInput] = useState('');
    const [editingPageInfo, setEditingPageInfo] = useState<{ id: string; name: string } | null>(null);

    const open = Boolean(anchorEl);
    const profileOpen = Boolean(profileAnchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => setProfileAnchorEl(event.currentTarget);
    const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => setMoreAnchorEl(event.currentTarget);
    const handleMoreClose = () => setMoreAnchorEl(null);
    const handleClose = () => {
        setAnchorEl(null);
        setEditingPageInfo(null);
        setPageNameInput('');
    };
    const handleProfileClose = () => setProfileAnchorEl(null);

    const [shareOpen, setShareOpen] = useState(false);

    const previewUrl = React.useMemo(() => {
        const base = window.location.origin + window.location.pathname + window.location.search + '#';
        const pageIdToUse = currentPageId || history.present.id;
        return `${base}/preview/${projectFromStore?.id || project?.id}/${pageIdToUse}`;
    }, [projectFromStore?.id, project?.id, currentPageId, history.present.id]);

    const handleSwitchPageAction = (pageId: string) => {
        if (editingPageInfo?.id === pageId) return; // Don't switch if we are editing this page's name
        onSwitchPage(pageId);
        handleClose();
    };

    const handleDeleteAction = (e: React.MouseEvent, pageId: string) => {
        e.stopPropagation();
        onDeletePage(pageId);
        if (editingPageInfo?.id === pageId) {
            setEditingPageInfo(null);
            setPageNameInput('');
        }
    };

    const handleStartEdit = (e: React.MouseEvent, page: Page) => {
        e.stopPropagation();
        setEditingPageInfo({ id: page.id, name: page.name });
        setPageNameInput(page.name);
        setTimeout(() => pageNameInputRef.current?.focus(), 100);
    };
    
    const handleConfirmAction = () => {
        const trimmedName = pageNameInput.trim();
        if (!trimmedName) return;

        if (editingPageInfo) {
            onUpdatePageName(editingPageInfo.id, trimmedName);
        } else {
            onAddPage(trimmedName);
        }
        
        handleClose();
    };
    
    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleConfirmAction();
        } else if (e.key === 'Escape') {
            handleClose();
        }
    };
    
    const handleExport = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(currentPage, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `${currentPage.name.toLowerCase().replace(/\s/g, '_')}.json`;
        link.click();
    };

    const handleDownloadProject = async () => {
        if (!project) return;

        try {
            // Generate React project files
            const projectFiles = generateReactProject(project);

            // Create zip file
            const zip = new JSZip();

            // Add all generated files to zip
            Object.entries(projectFiles).forEach(([filename, content]) => {
                zip.file(filename, content);
            });

            // Generate zip blob
            const zipBlob = await zip.generateAsync({ type: 'blob' });

            // Create download link
            const url = URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-react-project.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error generating React project:', error);
            alert('Error generating React project. Please try again.');
        }
    };

    const handleImportClick = () => {
        importInputRef.current?.click();
    };

    const handleLogout = () => {
        logout();
        handleProfileClose();
    };

    const handleProfileSettings = () => {
        navigate('/profile');
        handleProfileClose();
    };

    const currentPageName = project?.pages.find(p => p.id === currentPageId)?.name || 'Loading...';

    return (
        <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
            <Toolbar variant="dense">
                {/* Left Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Undo">
                        <span>
                           <IconButton size="small" disabled={!canUndo} onClick={() => dispatch(undo())}><Undo /></IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Redo">
                        <span>
                           <IconButton size="small" disabled={!canRedo} onClick={() => dispatch(redo())}><Redo /></IconButton>
                        </span>
                    </Tooltip>
                </Box>
                
                <Box sx={{ flexGrow: 1 }} />

                {/* Center Section - Absolutely Positioned */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                     <Button endIcon={<ArrowDropDown />} onClick={handleClick}>
                        {currentPageName}
                    </Button>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ sx: { p: 0, minWidth: '280px' } }}>
                        <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider' }}>
                            <TextField 
                                size="small"
                                placeholder={editingPageInfo ? 'Rename page...' : 'Create a new page...'}
                                variant="outlined"
                                fullWidth
                                value={pageNameInput}
                                onChange={e => setPageNameInput(e.target.value)}
                                onKeyDown={handleInputKeyDown}
                                onClick={e => e.stopPropagation()}
                                inputRef={pageNameInputRef}
                            />
                            <IconButton size="small" onClick={handleConfirmAction} disabled={!pageNameInput.trim()}>
                                {editingPageInfo ? <Check fontSize="small" /> : <Add />}
                            </IconButton>
                        </Box>
                        <Box sx={{ maxHeight: 250, overflowY: 'auto' }}>
                        {project?.pages.map(page => (
                            <MenuItem 
                                key={page.id} 
                                selected={page.id === currentPageId && !editingPageInfo}
                                onClick={() => handleSwitchPageAction(page.id)}
                                sx={{ 
                                    justifyContent: 'space-between',
                                    ...(editingPageInfo?.id === page.id && { bgcolor: 'action.hover' })
                                }}
                            >
                                <ListItemText primary={page.name} sx={{mr: 2}}/>
                                <Box>
                                    <Tooltip title="Rename">
                                        <IconButton size="small" onClick={(e) => handleStartEdit(e, page)} disabled={editingPageInfo?.id === page.id}>
                                            <Edit fontSize="inherit"/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton size="small" onClick={(e) => handleDeleteAction(e, page.id)}>
                                            <Delete fontSize="inherit"/>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </MenuItem>
                        ))}
                        </Box>
                    </Menu>
                </Box>

                {/* Right Section */}
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <input type="file" accept=".json" ref={importInputRef} style={{ display: 'none' }} onChange={onImport} />

                    <Tooltip title="More">
                        <IconButton size="small" onClick={handleMoreClick}><MoreVert /></IconButton>
                    </Tooltip>
                    <Menu anchorEl={moreAnchorEl} open={Boolean(moreAnchorEl)} onClose={handleMoreClose} MenuListProps={{ sx: { minWidth: 220 } }}>
                        <MenuItem onClick={() => { handleImportClick(); handleMoreClose(); }}>
                            <ListItemIcon><FileUpload fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Import JSON" />
                        </MenuItem>
                        <MenuItem onClick={() => { handleExport(); handleMoreClose(); }}>
                            <ListItemIcon><FileDownload fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Export JSON" />
                        </MenuItem>
                        <MenuItem onClick={() => { handleDownloadProject(); handleMoreClose(); }}>
                            <ListItemIcon><GetApp fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Download React Project" />
                        </MenuItem>
                        <MenuItem disableRipple disableTouchRipple onClick={(e) => e.stopPropagation()}>
                            <ListItemText primary="Auto Save" />
                            <Switch size="small" checked={autoSaveEnabled} onChange={(_, v) => onToggleAutoSave(v)} />
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => { setShareOpen(true); handleMoreClose(); }}>
                            <ListItemIcon><Share fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Share" />
                        </MenuItem>
                    </Menu>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                     <Tooltip title="Desktop">
                         <IconButton size="small" onClick={() => dispatch(setViewMode('desktop'))} color={viewMode === 'desktop' ? 'primary' : 'default'}><DesktopWindows /></IconButton>
                     </Tooltip>
                     <Tooltip title="Tablet">
                         <IconButton size="small" onClick={() => dispatch(setViewMode('tablet'))} color={viewMode === 'tablet' ? 'primary' : 'default'}><TabletMac /></IconButton>
                     </Tooltip>
                     <Tooltip title="Mobile">
                         <IconButton size="small" onClick={() => dispatch(setViewMode('mobile'))} color={viewMode === 'mobile' ? 'primary' : 'default'}><PhoneIphone /></IconButton>
                     </Tooltip>
                      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <FormControlLabel sx={{ mr: 1 }} control={<Switch size="small" checked={autoSaveEnabled} onChange={(_, v) => onToggleAutoSave(v)} />} label="Auto Save" />
                    <Tooltip title="Preview">
                        <IconButton size="small" onClick={onTogglePreview}><Visibility /></IconButton>
                    </Tooltip>

                    {/* Share Dialog */}
                    <Dialog open={shareOpen} onClose={() => setShareOpen(false)}>
                        <DialogTitle>Share Project</DialogTitle>
                        <DialogContent>
                            <Typography variant="body2" sx={{ mb: 1 }}>View-only link</Typography>
                            <TextField fullWidth size="small" value={previewUrl} InputProps={{ readOnly: true }} sx={{ mb: 2 }} />
                            <FormControlLabel control={<Switch checked={!!projectFromStore?.isPublic} onChange={() => { if (projectFromStore) dispatch(setProjectSharing({ projectId: projectFromStore.id, isPublic: !projectFromStore.isPublic })); }} />} label="Publicly accessible" />
                            <Typography variant="caption" color="text.secondary" display="block">Use the link above to share a preview. For real-time collaboration, connect Supabase in MCP and enable Live Collaboration in settings.</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { navigator.clipboard.writeText(previewUrl); }} variant="contained">Copy Link</Button>
                            <Button onClick={() => setShareOpen(false)}>Close</Button>
                        </DialogActions>
                    </Dialog>

                    {/* User Profile Section */}
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <Tooltip title="Account">
                        <IconButton
                            size="small"
                            onClick={handleProfileClick}
                            sx={{ p: 0.5 }}
                        >
                            {user?.avatar ? (
                                <Avatar
                                    src={user.avatar}
                                    alt={user.name}
                                    sx={{ width: 32, height: 32 }}
                                />
                            ) : (
                                <AccountCircle sx={{ fontSize: 32 }} />
                            )}
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={profileAnchorEl}
                        open={profileOpen}
                        onClose={handleProfileClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        MenuListProps={{ sx: { minWidth: '200px' } }}
                    >
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                {user?.avatar ? (
                                    <Avatar
                                        src={user.avatar}
                                        alt={user.name}
                                        sx={{ width: 40, height: 40 }}
                                    />
                                ) : (
                                    <AccountCircle sx={{ fontSize: 40, color: 'text.secondary' }} />
                                )}
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {user?.name || 'Guest User'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {user?.email || 'guest@example.com'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <MenuItem onClick={handleProfileSettings}>
                            <Person sx={{ mr: 1.5 }} />
                            <ListItemText primary="Profile Settings" />
                        </MenuItem>

                        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                            <Logout sx={{ mr: 1.5 }} />
                            <ListItemText primary="Logout" />
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
