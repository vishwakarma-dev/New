import React from 'react';
import { Page, EditorElement, ContainerProps, StackProps, CardProps, AccordionProps } from '../../types';
import { Box, Typography, Collapse, IconButton, ListItemIcon, Tabs, Tab, TextField, InputAdornment, Button, Menu, MenuItem } from '@mui/material';
import { ExpandMore, ChevronRight, Search, Add } from '@mui/icons-material';
import { AVAILABLE_COMPONENTS } from '../../constants';

interface LayerPanelProps {
    page: Page;
    selectedElementId: string | null;
    onSelectElement: (id: string) => void;
    onAddPage: (name: string) => void;
}

const TreeItem: React.FC<{
    element: EditorElement;
    allElements: { [key: string]: EditorElement };
    level: number;
} & Omit<LayerPanelProps, 'onAddPage'>> = ({ element, allElements, level, page, selectedElementId, onSelectElement }) => {

    const [isOpen, setIsOpen] = React.useState(true);
    const isSelected = selectedElementId === element.id;

    const props = element.props as ContainerProps | StackProps | CardProps | AccordionProps;
    const hasChildren = props.children && props.children.length > 0;

    const componentDef = AVAILABLE_COMPONENTS.find(c => c.type === element.type);
    const icon = componentDef ? componentDef.icon : null;

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectElement(element.id);
    };
    
    const toggleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if(hasChildren) setIsOpen(!isOpen);
    }

    return (
        <>
            <Box
                onClick={handleSelect}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    pl: level * 2,
                    py: 0.5,
                    cursor: 'pointer',
                    borderRadius: 1,
                    bgcolor: isSelected ? 'action.selected' : 'transparent',
                    '&:hover': {
                        bgcolor: isSelected ? 'action.selected' : 'action.hover',
                    },
                }}
            >
                <IconButton size="small" onClick={toggleOpen} sx={{ visibility: hasChildren ? 'visible' : 'hidden' }}>
                    {isOpen ? <ExpandMore fontSize="inherit" /> : <ChevronRight fontSize="inherit" />}
                </IconButton>
                 {icon && (
                    <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                       {React.cloneElement(icon as React.ReactElement<any>, { sx: { fontSize: '1.1rem' } })}
                    </ListItemIcon>
                )}
                <Typography variant="body2" component="span" sx={{ flexGrow: 1, userSelect: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {element.name}
                </Typography>
            </Box>
            {hasChildren && (
                 <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    {props.children?.map(childId => {
                        const childElement = allElements[childId];
                        return childElement ? (
                            <TreeItem
                                key={childId}
                                element={childElement}
                                allElements={allElements}
                                level={level + 1}
                                selectedElementId={selectedElementId}
                                onSelectElement={onSelectElement}
                                page={page}
                            />
                        ) : null;
                    })}
                </Collapse>
            )}
        </>
    );
};


const LayerPanel: React.FC<LayerPanelProps> = ({ page, selectedElementId, onSelectElement, onAddPage }) => {
    const rootElement = page.elements[page.rootElementId];
    const [tabIndex, setTabIndex] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const handleAddPage = () => {
        const newPageName = prompt("Enter a name for the new screen:", "New Screen");
        if (newPageName) {
            onAddPage(newPageName);
        }
        handleMenuClose();
    };
    
    if (!rootElement) {
        return <Typography sx={{p: 2}}>No elements on page.</Typography>;
    }

    return (
        <Box>
             <Box sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                bgcolor: 'background.paper',
            }}>
                <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
                    <Tab label="Screens" />
                    <Tab label="Components" />
                </Tabs>
            </Box>
            {tabIndex === 0 && (
                <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                     <TextField 
                        placeholder="Search"
                        variant="outlined"
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                        }}
                    />
                     <Button 
                        variant="text" 
                        startIcon={<Add />}
                        onClick={handleMenuClick}
                        sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                        endIcon={<ChevronRight />}
                    >
                        New screen
                    </Button>
                     <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleAddPage}>Blank screen</MenuItem>
                      </Menu>
                    <TreeItem
                        element={rootElement}
                        allElements={page.elements}
                        level={0}
                        selectedElementId={selectedElementId}
                        onSelectElement={onSelectElement}
                        page={page}
                    />
                </Box>
            )}
            {tabIndex === 1 && (
                <Box sx={{ p: 2 }}>
                    <Typography>Components view coming soon.</Typography>
                </Box>
            )}
        </Box>
    );
};

export default LayerPanel;