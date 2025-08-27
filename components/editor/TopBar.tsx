import React, { useState, useRef } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Divider, Menu, MenuItem, ListItemText, Tooltip, TextField } from '@mui/material';
import { Undo, Redo, Visibility, ArrowDropDown, Add, Edit, Delete, DesktopWindows, TabletMac, PhoneIphone, FileUpload, FileDownload, Check, GetApp } from '@mui/icons-material';
import { Project, Page, ViewMode } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setViewMode, undo, redo } from '../../store/editorSlice';


interface TopBarProps {
    project: Project | undefined;
    currentPageId: string | null;
    onSwitchPage: (pageId: string) => void;
    onAddPage: (name: string) => void;
    onDeletePage: (pageId: string) => void;
    onUpdatePageName: (pageId: string, newName: string) => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onTogglePreview: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ project, currentPageId, onSwitchPage, onAddPage, onDeletePage, onUpdatePageName, onImport, onTogglePreview }) => {
    const dispatch: AppDispatch = useDispatch();
    const { history, viewMode } = useSelector((state: RootState) => state.editor);
    const currentPage = history.present;
    const canUndo = history.past.length > 0;
    const canRedo = history.future.length > 0;
    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const importInputRef = useRef<HTMLInputElement>(null);
    const pageNameInputRef = useRef<HTMLInputElement>(null);
    
    // State for unified Add/Edit
    const [pageNameInput, setPageNameInput] = useState('');
    const [editingPageInfo, setEditingPageInfo] = useState<{ id: string; name: string } | null>(null);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => {
        setAnchorEl(null);
        setEditingPageInfo(null);
        setPageNameInput('');
    };
    
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

    const handleDownloadProject = () => {
        if (!project) return;

        const projectData = {
            ...project,
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        };

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(projectData, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `${project.name.toLowerCase().replace(/\s/g, '_')}_project.json`;
        link.click();
    };

    const handleImportClick = () => {
        importInputRef.current?.click();
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
                    <Tooltip title="Import JSON">
                        <IconButton size="small" onClick={handleImportClick}><FileUpload /></IconButton>
                    </Tooltip>
                    <Tooltip title="Export JSON">
                        <IconButton size="small" onClick={handleExport}><FileDownload /></IconButton>
                    </Tooltip>
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
                    <Tooltip title="Preview">
                        <IconButton size="small" onClick={onTogglePreview}><Visibility /></IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
