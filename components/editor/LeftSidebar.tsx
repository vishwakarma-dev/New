import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Paper, IconButton, Tooltip, Collapse, Tabs, Tab } from '@mui/material';
import { ElementType, Template, Layout, Page, DataSource, AnyElementPropKey, EditorElement } from '../../types';
import { AVAILABLE_COMPONENTS, AVAILABLE_TEMPLATES } from '../../constants';
import { Close, AccountTree, Add, DataObject, Search, Settings, AutoAwesome, PhotoLibrary, Comment, History } from '@mui/icons-material';
import LayerPanel from './LayerPanel';
import DataPanel from './DataPanel';
import AiChatPanel from './AiChatPanel';
import SettingsPanel from './SettingsPanel';
import MediaPanel from './MediaPanel';
import CommentsPanel from './CommentsPanel';
import HistoryPanel from './HistoryPanel';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


const DraggableItem: React.FC<{ name: string; icon: React.ReactNode; onDragStart: (e: React.DragEvent) => void; }> = ({ name, icon, onDragStart }) => {
    return (
        <Grid size={6}>
            <Paper
                draggable
                onDragStart={onDragStart}
                variant="outlined"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 1.5,
                    cursor: 'grab',
                    transition: 'background-color 0.2s, border-color 0.2s',
                    '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main',
                        color: "primary.main",
                    },
                    textAlign: 'center',
                    height: '100px'
                }}
            >
                {React.cloneElement(icon as React.ReactElement<any>, { sx: { fontSize: '2rem', mb: 1 } })}
                <Typography variant="caption" sx={{ mt: 'auto', lineHeight: '1.2', display: 'block', height: '2.4em' }}>
                    {name}
                </Typography>
            </Paper>
        </Grid>
    );
};

const LayoutIcon: React.FC<{ rows: number; cols: number }> = ({ rows, cols }) => (
    <Box
        sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: '3px',
            width: 36,
            height: 36,
            color: 'inherit',
        }}
    >
        {Array.from({ length: rows * cols }).map((_, i) => (
            <Box key={i} sx={{ bgcolor: 'currentColor', borderRadius: '1px' }} />
        ))}
    </Box>
);

type LayoutWithIcon = Layout & { icon: React.ReactNode };
const LAYOUTS: LayoutWithIcon[] = [
    { name: '2 Columns', rows: 1, cols: 2, icon: <LayoutIcon rows={1} cols={2} /> },
    { name: '3 Columns', rows: 1, cols: 3, icon: <LayoutIcon rows={1} cols={3} /> },
    { name: '4 Columns', rows: 1, cols: 4, icon: <LayoutIcon rows={1} cols={4} /> },
    { name: '2x2 Grid', rows: 2, cols: 2, icon: <LayoutIcon rows={2} cols={2} /> },
];

const InsertPanel: React.FC = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const editorProjectId = useSelector((s: RootState) => s.editor.projectId);
    const project = useSelector((s: RootState) => s.projects.projects.find(p => p.id === editorProjectId));

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleDragStart = (e: React.DragEvent, type: 'component' | 'layout' | 'template', data: any) => {
        e.dataTransfer.effectAllowed = 'copy';
        if (type === 'component') e.dataTransfer.setData('newComponentType', data);
        else if (type === 'layout') e.dataTransfer.setData('newLayout', JSON.stringify(data));
        else if (type === 'template') e.dataTransfer.setData('newTemplate', JSON.stringify(data));
    };

    const userComponents = project?.reusableComponents || [];

    const tabData = [
        {
            label: "Elements",
            content: (
                <>
                    <Typography variant="overline" color="text.secondary" display="block" mb={1.5}>
                        Layouts
                    </Typography>
                     <Grid container spacing={1.5}>
                        {LAYOUTS.map(layout => {
                            const { icon, ...layoutData } = layout;
                            return <DraggableItem key={layout.name} name={layout.name} icon={icon} onDragStart={(e) => handleDragStart(e, 'layout', layoutData)} />
                        })}
                     </Grid>
                    <Typography variant="overline" color="text.secondary" display="block" mt={3} mb={1.5}>
                        Basic Elements
                    </Typography>
                    <Grid container spacing={1.5}>
                        {AVAILABLE_COMPONENTS.map(comp => (
                            <DraggableItem key={comp.type} name={comp.name} icon={comp.icon} onDragStart={(e) => handleDragStart(e, 'component', comp.type)} />
                        ))}
                    </Grid>
                </>
            )
        },
        {
            label: "Components",
            content: (
                userComponents.length > 0 ? (
                    <Grid container spacing={1.5}>
                        {userComponents.map((template: any) => (
                            <DraggableItem key={template.name} name={template.name} icon={template.icon || <span />} onDragStart={(e) => handleDragStart(e, 'template', template)} />
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                        <Typography variant="body2" color="text.secondary">
                            Save elements as reusable components from the Inspector.
                        </Typography>
                    </Box>
                )
            )
        },
        {
            label: "Templates",
            content: (
                <Grid container spacing={1.5}>
                    {AVAILABLE_TEMPLATES.map(template => (
                         <DraggableItem key={template.name} name={template.name} icon={template.icon} onDragStart={(e) => handleDragStart(e, 'template', template)} />
                    ))}
                </Grid>
            )
        },
    ];

    return (
         <Box>
            <Box sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                bgcolor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider',
            }}>
                <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
                    {tabData.map((tab, i) => <Tab key={i} label={tab.label} />)}
                </Tabs>
            </Box>
            <Box sx={{ p: 1.5 }}>
                 {tabData[tabIndex].content}
            </Box>
        </Box>
    );
}

interface LeftSidebarProps {
    onToggleExpand: (isExpanded: boolean) => void;
    page: Page;
    selectedElementId: string | null;
    onSelectElement: (id: string) => void;
    onAddPage: (name: string) => void;
    dataSources: DataSource[];
    onAddDataSource: (name: string, url: string) => void;
    onDeleteDataSource: (id: string) => void;
    onUpdateElementProp: (elementId: string, prop: AnyElementPropKey, value: any) => void;
    onDeleteElement: (elementId: string) => void;
    onAddElement: (parentId: string, element: EditorElement, index: number) => void;
}

type PanelType = 'layers' | 'insert' | 'data' | 'media' | 'ai' | 'comments' | 'history' | 'search' | 'settings';

const LeftSidebar: React.FC<LeftSidebarProps> = (props) => {
    const [activePanel, setActivePanel] = useState<PanelType | null>('layers');

    useEffect(() => {
        props.onToggleExpand(activePanel !== null);
    }, [activePanel, props.onToggleExpand]);

    const handlePanelToggle = (panel: PanelType) => {
        setActivePanel(prev => (prev === panel ? null : panel));
    };

    const handleClose = () => setActivePanel(null);

    const panels: { [key in PanelType]: { title: string; icon: React.ReactNode; component: React.ReactNode; } } = {
        layers: { title: 'Tree view', icon: <AccountTree />, component: <LayerPanel page={props.page} selectedElementId={props.selectedElementId} onSelectElement={props.onSelectElement} onAddPage={props.onAddPage} /> },
        insert: { title: 'Insert', icon: <Add />, component: <InsertPanel /> },
        data: { title: 'Data', icon: <DataObject />, component: <DataPanel dataSources={props.dataSources} onAddDataSource={props.onAddDataSource} onDeleteDataSource={props.onDeleteDataSource} /> },
        media: { title: 'Media Library', icon: <PhotoLibrary />, component: <MediaPanel /> },
        ai: { title: 'AI Assistant', icon: <AutoAwesome />, component: <AiChatPanel page={props.page} selectedElementId={props.selectedElementId} onUpdateElementProp={props.onUpdateElementProp} onDeleteElement={props.onDeleteElement} onAddElement={props.onAddElement} onSelectElement={props.onSelectElement} /> },
        comments: { title: 'Comments', icon: <Comment />, component: <CommentsPanel selectedElementId={props.selectedElementId} /> },
        history: { title: 'History', icon: <History />, component: <HistoryPanel /> },
        search: { title: 'Search', icon: <Search />, component: <Typography p={2}>Search panel coming soon.</Typography> },
        settings: { title: 'App Settings', icon: <Settings />, component: <SettingsPanel /> },
    };
    
    const iconBarItems = [
        { key: 'layers', title: 'Tree View' },
        { key: 'insert', title: 'Insert' },
        { key: 'data', title: 'Data Sources' },
        { key: 'media', title: 'Media Library' },
        { key: 'comments', title: 'Comments' },
        { key: 'ai', title: 'AI Assistant' },
        { key: 'search', title: 'Search' },
    ];

    const bottomBarItems = [
        { key: 'history', title: 'Version History' },
        { key: 'settings', title: 'App Settings' },
    ];

    return (
        <Box sx={{ display: 'flex', height: '100%', width: '100%', bgcolor: 'background.paper' }}>
            {/* Icon Bar */}
            <Box sx={{ width: 64, borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1, gap: 1 }}>
                 {iconBarItems.map(item => (
                    <Tooltip title={item.title} placement="right" key={item.key}>
                        <IconButton onClick={() => handlePanelToggle(item.key as PanelType)} color={activePanel === item.key ? 'primary' : 'default'}>
                            {panels[item.key as PanelType].icon}
                        </IconButton>
                    </Tooltip>
                 ))}
                 <Box flexGrow={1} />
                 {bottomBarItems.map(item => (
                    <Tooltip title={item.title} placement="right" key={item.key}>
                        <IconButton onClick={() => handlePanelToggle(item.key as PanelType)} color={activePanel === item.key ? 'primary' : 'default'}>
                            {panels[item.key as PanelType].icon}
                        </IconButton>
                    </Tooltip>
                 ))}
            </Box>

            {/* Content Panel */}
            <Collapse in={activePanel !== null} orientation="horizontal" sx={{
                // Required for smooth collapse transition with flexbox containers
                '& .MuiCollapse-wrapper': { width: '100%' },
                '& .MuiCollapse-wrapperInner': { width: '100%' }
            }}>
                <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', height: '100%', borderRight: 1, borderColor: 'divider' }}>
                    {activePanel && (
                        <>
                            {/* Header */}
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', height: 48, flexShrink: 0 }}>
                                <Typography variant="subtitle1" fontWeight="bold">{panels[activePanel].title}</Typography>
                                <IconButton onClick={handleClose} size="small"><Close /></IconButton>
                            </Box>
                            {/* Content */}
                            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                                {panels[activePanel].component}
                            </Box>
                        </>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
};

export default LeftSidebar;
