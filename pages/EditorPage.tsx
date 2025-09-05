import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../components/editor/TopBar';
import LeftSidebar from '../components/editor/LeftSidebar';
import PropertiesPanel from '../components/editor/PropertiesPanel';
import Canvas from '../components/editor/Canvas';
import AddElementMenu from '../components/editor/AddElementMenu';
import { ElementType, EditorElement, AnyElementPropKey, Page, Template, ThemeSettings, DataSource, Layout } from '../types';
import { AVAILABLE_COMPONENTS } from '../constants';
import { Box, Typography, Button, createTheme, ThemeProvider } from '@mui/material';
import { VisibilityOff } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setSelectedElement, updateElementProp, addElement, initializeEditor, loadPage, updateCurrentPageData, addLayout, togglePreview, deleteElement, moveElement, addTemplate, updateTheme, addDataSource, deleteDataSource, updateDataSource } from '../store/editorSlice';
import { addPage, deletePage, updatePageName, updatePageContent } from '../store/projectsSlice';

const EditorPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const dispatch: AppDispatch = useDispatch();

    const { history, selectedElementId, viewMode, projectId: editorProjectId, currentPageId, isPreviewing } = useSelector((state: RootState) => state.editor);
    const page = history.present;
    const projects = useSelector((state: RootState) => state.projects.projects);
    const selectedElement = selectedElementId ? page.elements[selectedElementId] : null;
    const project = projects.find(p => p.id === projectId);
    const topBarHeight = 48; // Dense toolbar height

    const userSettings = useSelector((state: RootState) => state.userSettings);
    const autoSaveEnabled = userSettings.autoSave;

    const [addMenuAnchorEl, setAddMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [addMenuContainerId, setAddMenuContainerId] = useState<string | null>(null);
    const [addMenuInsertionIndex, setAddMenuInsertionIndex] = useState(0);
    const [isLeftPanelExpanded, setIsLeftPanelExpanded] = useState(true);

    const dynamicTheme = React.useMemo(() => {
        const themeSettings = page?.theme;
        return createTheme({
            spacing: themeSettings?.spacingUnit ?? 8,
            typography: {
                fontFamily: themeSettings?.fontFamily || 'Roboto, sans-serif',
            },
            shape: {
                borderRadius: themeSettings?.borderRadius ?? 8,
            },
            palette: {
                primary: {
                    main: themeSettings?.primaryColor || '#1976d2',
                },
                secondary: {
                    main: themeSettings?.secondaryColor || '#dc004e',
                },
                background: {
                    default: '#f7f9fc',
                    paper: themeSettings?.backgroundColor || '#ffffff',
                }
            },
            components: {
                MuiButtonBase: {
                    defaultProps: {
                        disableRipple: true,
                    },
                },
            }
        });
    }, [page?.theme]);

    // Effect for initializing or re-syncing the editor state
    useEffect(() => {
        if (project && project.pages.length > 0) {
            // Initialize if project changed or current page is no longer valid
            if (editorProjectId !== projectId || !project.pages.some(p => p.id === currentPageId)) {
                dispatch(initializeEditor({ projectId: project.id, page: project.pages[0] }));
            }
        }
    }, [projectId, project, dispatch, editorProjectId, currentPageId]);

    // Effect to handle switching to a safe page if the current one is deleted
    useEffect(() => {
        if (project && currentPageId) {
            const currentPageExists = project.pages.some(p => p.id === currentPageId);
            if (!currentPageExists && project.pages.length > 0) {
                // The current page was deleted, switch to the first available page
                dispatch(loadPage(project.pages[0]));
            }
        }
    }, [project?.pages, currentPageId, dispatch]);


    const handleSelectElement = useCallback((id: string) => {
        dispatch(setSelectedElement(id));
    }, [dispatch]);

    const handleUpdateProps = useCallback((elementId: string, prop: AnyElementPropKey, value: any) => {
        dispatch(updateElementProp({ elementId, prop, value }));
    }, [dispatch]);

    const handleUpdateTheme = useCallback((theme: ThemeSettings) => {
        dispatch(updateTheme(theme));
    }, [dispatch]);

    const handleDeleteElement = useCallback((elementId: string) => {
        if(window.confirm('Are you sure you want to delete this element and all its children?')) {
            dispatch(deleteElement({ elementId }));
        }
    }, [dispatch]);

    const handleMoveElement = useCallback((draggedElementId: string, targetContainerId: string, newIndex: number) => {
        dispatch(moveElement({ draggedElementId, targetContainerId, newIndex }));
    }, [dispatch]);

    const handleOpenAddMenu = useCallback((anchorEl: HTMLElement, containerId: string, index: number) => {
        setAddMenuAnchorEl(anchorEl);
        setAddMenuContainerId(containerId);
        setAddMenuInsertionIndex(index);
    }, []);

    const handleCloseAddMenu = useCallback(() => {
        setAddMenuAnchorEl(null);
        setAddMenuContainerId(null);
        setAddMenuInsertionIndex(0);
    }, []);

    const handleAddComponent = useCallback((elementType: ElementType) => {
        if (!addMenuContainerId) return;
        const componentDefinition = AVAILABLE_COMPONENTS.find(c => c.type === elementType);
        if (!componentDefinition) return;
        const newElement: EditorElement = {
            id: `el-${Date.now()}`,
            name: componentDefinition.name,
            type: componentDefinition.type,
            props: { ...componentDefinition.defaultProps },
        };
        dispatch(addElement({ parentId: addMenuContainerId, element: newElement, index: addMenuInsertionIndex }));
        handleCloseAddMenu();
    }, [dispatch, addMenuContainerId, addMenuInsertionIndex, handleCloseAddMenu]);

    const handleAddElement = useCallback((parentId: string, element: EditorElement, index: number) => {
        dispatch(addElement({ parentId, element, index }));
    }, [dispatch]);


    const handleAddLayout = useCallback((layout: Layout) => {
        if (!addMenuContainerId) return;
        dispatch(addLayout({ parentId: addMenuContainerId, layout, index: addMenuInsertionIndex }));
        handleCloseAddMenu();
    }, [dispatch, addMenuContainerId, addMenuInsertionIndex, handleCloseAddMenu]);

    const handleAddTemplate = useCallback((template: Template) => {
        if (!addMenuContainerId) return;
        dispatch(addTemplate({ parentId: addMenuContainerId, template, index: addMenuInsertionIndex }));
        handleCloseAddMenu();
    }, [dispatch, addMenuContainerId, addMenuInsertionIndex, handleCloseAddMenu]);
    
    const handleDropNewElement = useCallback((itemType: string, itemData: string, targetContainerId: string, index: number) => {
        switch (itemType) {
            case 'component': {
                const componentType = itemData as ElementType;
                const componentDefinition = AVAILABLE_COMPONENTS.find(c => c.type === componentType);
                if (!componentDefinition) return;
                const newElement: EditorElement = {
                    id: `el-${Date.now()}`,
                    name: componentDefinition.name,
                    type: componentDefinition.type,
                    props: { ...componentDefinition.defaultProps },
                };
                dispatch(addElement({ parentId: targetContainerId, element: newElement, index }));
                break;
            }
            case 'layout': {
                const layout = JSON.parse(itemData) as Layout;
                dispatch(addLayout({ parentId: targetContainerId, layout, index }));
                break;
            }
            case 'template': {
                const template = JSON.parse(itemData) as Template;
                dispatch(addTemplate({ parentId: targetContainerId, template, index }));
                break;
            }
            default:
                break;
        }
    }, [dispatch]);

    const handleSwitchPage = useCallback((pageId: string) => {
        if (!projectId || !currentPageId || pageId === currentPageId) return;

        dispatch(updatePageContent({ projectId, pageId: currentPageId, content: page }));
        
        const newPageToLoad = project?.pages.find(p => p.id === pageId);
        if (newPageToLoad) {
            dispatch(loadPage(newPageToLoad));
        }
    }, [dispatch, projectId, currentPageId, page, project]);

    // Effect to auto-switch to a newly created page
    const prevPageCountRef = useRef(project?.pages.length);
    useEffect(() => {
        if (!project) return;
        const pageCount = project.pages.length;
        // Check if a page was added
        if (prevPageCountRef.current !== undefined && pageCount > prevPageCountRef.current) {
            const newPage = project.pages[pageCount - 1]; // The new page is the last one
            if (newPage && newPage.id !== currentPageId) {
                handleSwitchPage(newPage.id);
            }
        }
        prevPageCountRef.current = pageCount;
    }, [project?.pages, handleSwitchPage, currentPageId]);

    // Auto-save: persist to localStorage with debounce
    const autoSaveTimer = useRef<number | null>(null);
    // autoSaveEnabled comes from user settings

    useEffect(() => {
        if (!autoSaveEnabled || !projectId || !currentPageId) return;
        if (autoSaveTimer.current) window.clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = window.setTimeout(() => {
            try {
                const key = `autosave:${projectId}:${currentPageId}`;
                const payload = { timestamp: Date.now(), page };
                localStorage.setItem(key, JSON.stringify(payload));
            } catch {}
        }, 800);
        return () => { if (autoSaveTimer.current) window.clearTimeout(autoSaveTimer.current); };
    }, [page, autoSaveEnabled, projectId, currentPageId]);

    // Offer restore on page load if an autosave exists
    useEffect(() => {
        if (!projectId || !currentPageId) return;
        const key = `autosave:${projectId}:${currentPageId}`;
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return;
            const saved = JSON.parse(raw) as { timestamp: number; page: Page };
            // Only prompt once per page load
            if (saved && saved.page && window.confirm('A locally auto-saved version was found. Restore it?')) {
                dispatch(updateCurrentPageData(saved.page));
            }
        } catch {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, currentPageId]);

    const handleAddPage = (name: string) => {
        if (projectId) {
            const pageName = name.trim() ? name.trim() : 'Untitled Page';
            dispatch(addPage({ projectId, pageName }));
        }
    };

    const handleDeletePage = (pageId: string) => {
        if (project && project.pages.length <= 1) {
            alert("Cannot delete the last page of a project.");
            return;
        }
        if (projectId && window.confirm('Are you sure you want to delete this page?')) {
            dispatch(deletePage({ projectId, pageId }));
        }
    };
    
    const handleUpdatePageName = (pageId: string, newName: string) => {
        if(projectId && pageId && newName) {
            dispatch(updatePageName({ projectId, pageId, newName: newName.trim() }));
        }
    }

    const handleImportPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result;
                    if (typeof content === 'string') {
                        const importedPage = JSON.parse(content);
                        if(importedPage.id && importedPage.name && importedPage.elements){
                            dispatch(updateCurrentPageData(importedPage));
                        } else {
                            alert('Invalid page JSON format.');
                        }
                    }
                } catch (error) {
                    alert('Failed to parse JSON file.');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleTogglePreview = () => {
        dispatch(togglePreview());
    };

    const handleAddDataSource = useCallback(async (name: string, url: string) => {
        const newDataSource: DataSource = { id: `ds-${Date.now()}`, name, url, data: null, status: 'loading', error: null };
        dispatch(addDataSource(newDataSource));
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            dispatch(updateDataSource({ id: newDataSource.id, data, status: 'success' }));
        } catch (e: any) {
            dispatch(updateDataSource({ id: newDataSource.id, error: e.message, status: 'error' }));
        }
    }, [dispatch]);

    const handleDeleteDataSource = useCallback((id: string) => {
        dispatch(deleteDataSource({ id }));
    }, [dispatch]);

    if (isPreviewing) {
        return (
            <ThemeProvider theme={dynamicTheme}>
                <Box sx={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', bgcolor: 'grey.200' }}>
                    <Box sx={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 1301 }}>
                        <Button 
                            variant="contained" 
                            onClick={handleTogglePreview}
                            startIcon={<VisibilityOff />}
                            sx={{ 
                                bgcolor: 'rgba(0, 0, 0, 0.6)', 
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' } 
                            }}
                        >
                            Exit Preview
                        </Button>
                    </Box>
                    <Canvas 
                        page={page}
                        viewMode={viewMode}
                        selectedElementId={selectedElementId}
                        onSelectElement={handleSelectElement}
                        onMoveElement={handleMoveElement}
                        isPreviewing={true}
                    />
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={dynamicTheme}>
            <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw', overflow: 'hidden' }}>
                 {/* Left Panel */}
                <Box component="aside" sx={{
                    width: isLeftPanelExpanded ? '364px' : '64px',
                    flexShrink: 0,
                    transition: 'width 0.2s ease-in-out',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <LeftSidebar 
                        onToggleExpand={setIsLeftPanelExpanded}
                        page={page}
                        selectedElementId={selectedElementId}
                        onSelectElement={handleSelectElement}
                        onAddPage={handleAddPage}
                        dataSources={page.dataSources || []}
                        onAddDataSource={handleAddDataSource}
                        onDeleteDataSource={handleDeleteDataSource}
                        onUpdateElementProp={handleUpdateProps}
                        onDeleteElement={handleDeleteElement}
                        onAddElement={handleAddElement}
                    />
                </Box>
                {/* Center Panel */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <TopBar
                        project={project}
                        currentPageId={currentPageId}
                        onSwitchPage={handleSwitchPage}
                        onAddPage={handleAddPage}
                        onDeletePage={handleDeletePage}
                        onUpdatePageName={handleUpdatePageName}
                        onImport={handleImportPage}
                        onTogglePreview={handleTogglePreview}
                        autoSaveEnabled={autoSaveEnabled}
                        onToggleAutoSave={setAutoSaveEnabled}
                    />
                    <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: 'grey.200' }}>
                        <Canvas 
                            page={page}
                            viewMode={viewMode}
                            selectedElementId={selectedElementId}
                            onSelectElement={handleSelectElement}
                            onDeleteElement={handleDeleteElement}
                            onMoveElement={handleMoveElement}
                            onOpenAddMenu={handleOpenAddMenu}
                            onDropNewElement={handleDropNewElement}
                            onAddElement={handleAddElement}
                            isPreviewing={false}
                        />
                    </Box>
                </Box>
                
                {/* Right Panel */}
                <Box component="aside" sx={{ width: '20%', minWidth: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', borderLeft: 1, borderColor: 'divider' }}>
                     <Box sx={{
                        height: topBarHeight,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        borderBottom: 1,
                        borderColor: 'divider',
                        gap: 1.5,
                    }}>
                        <Typography variant="subtitle1" fontWeight="bold">Inspector</Typography>
                    </Box>
                     <PropertiesPanel 
                        selectedElement={selectedElement} 
                        onUpdateProps={handleUpdateProps}
                        page={page}
                        onUpdateTheme={handleUpdateTheme}
                    />
                </Box>
            </Box>
             <AddElementMenu
                anchorEl={addMenuAnchorEl}
                onClose={handleCloseAddMenu}
                onAddComponent={handleAddComponent}
                onAddLayout={handleAddLayout}
                onAddTemplate={handleAddTemplate}
            />
        </ThemeProvider>
    );
};

export default EditorPage;
