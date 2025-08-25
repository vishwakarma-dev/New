import React, { useState, useEffect } from 'react';
import { Grid, Menu, Box, Typography, Paper } from '@mui/material';
import { ElementType, Template, Layout } from '../../types';
import { AVAILABLE_COMPONENTS, AVAILABLE_TEMPLATES } from '../../constants';
import { Widgets, GridView, ViewQuilt } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  // IMPORTANT: We keep the children mounted and use the `hidden` attribute
  // to toggle visibility. Unmounting/remounting the children was causing
  // the Popover to resize and incorrectly recalculate its position.
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`add-menu-tabpanel-${index}`}
      aria-labelledby={`add-menu-tab-${index}`}
      {...other}
    >
      {/* The key fix is using a fixed height here, not maxHeight. This prevents the Popover from resizing. */}
      <Box sx={{ pt: 2, height: 400, overflowY: 'auto' }}>
        {children}
      </Box>
    </div>
  );
}

const ItemButton: React.FC<{ name: string; icon: React.ReactNode; onClick: () => void; }> = ({ name, icon, onClick }) => {
    return (
        <Grid size={{ xs:6, sm:4}}>
            <Paper
                variant="outlined"
                onClick={onClick}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 1.5,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, border-color 0.2s',
                    '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main',
                        color : "primary.main",
                    },
                    textAlign: 'center',
                    height: '100px'
                }}
            >
                {React.cloneElement(icon as React.ReactElement<any>, { sx: { fontSize: '2rem' } })}
                <Typography variant="caption" sx={{ mt: 1, lineHeight: '1.2', display: 'block', height: '2.4em' }}>
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
  { name: '3x3 Grid', rows: 3, cols: 3, icon: <LayoutIcon rows={3} cols={3} /> },
  { name: '4x4 Grid', rows: 4, cols: 4, icon: <LayoutIcon rows={4} cols={4} /> },
];

interface AddElementMenuProps {
    anchorEl: null | HTMLElement;
    onClose: () => void;
    onAddComponent: (type: ElementType) => void;
    onAddLayout: (layout: Layout) => void;
    onAddTemplate: (template: Template) => void;
}

const AddElementMenu: React.FC<AddElementMenuProps> = ({ anchorEl, onClose, onAddComponent, onAddLayout, onAddTemplate }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const isOpen = Boolean(anchorEl);

    useEffect(() => {
        if (!isOpen) {
            // Reset to the first tab when the menu is closed
            setTimeout(() => setTabIndex(0), 150);
        }
    }, [isOpen]);
    
    const handleLayoutClick = (layout: LayoutWithIcon) => {
        const { icon, ...layoutData } = layout;
        onAddLayout(layoutData);
    }
    
    const tabsData = [
      { label: 'Components', icon: <Widgets fontSize="small" /> },
      { label: 'Layouts', icon: <GridView fontSize="small" /> },
      { label: 'Templates', icon: <ViewQuilt fontSize="small" /> },
    ];

    return (
        <Menu
            anchorEl={anchorEl}
            open={isOpen}
            onClose={onClose}
            MenuListProps={{ sx: { p: 0 } }}
            slotProps={{
                paper: {
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                        mt: 1.5,
                        width: 400,
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            width: 12,
                            height: 12,
                            bgcolor: 'background.paper',
                            transform: 'translate(-50%, -50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                },
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
        >
            <Box sx={{ p: 2, pt: 1 }}>
                {/* Custom Tab Implementation */}
                <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
                    {tabsData.map((tab, index) => (
                        <Box
                            key={index}
                            onClick={() => setTabIndex(index)}
                            sx={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                py: 1.5,
                                cursor: 'pointer',
                                color: tabIndex === index ? 'primary.main' : 'text.secondary',
                                borderBottom: 2,
                                borderColor: tabIndex === index ? 'primary.main' : 'transparent',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                }
                            }}
                        >
                            {tab.icon}
                            <Typography variant="body2" sx={{ fontWeight: tabIndex === index ? 'bold' : 500 }}>
                                {tab.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <TabPanel value={tabIndex} index={0}>
                     <Grid container spacing={1}>
                        {AVAILABLE_COMPONENTS.map(comp => (
                            <ItemButton key={comp.type} name={comp.name} icon={comp.icon} onClick={() => onAddComponent(comp.type)} />
                        ))}
                    </Grid>
                </TabPanel>

                <TabPanel value={tabIndex} index={1}>
                     <Grid container spacing={1}>
                        {LAYOUTS.map(layout => (
                            <ItemButton key={layout.name} name={layout.name} icon={layout.icon} onClick={() => handleLayoutClick(layout)} />
                        ))}
                     </Grid>
                </TabPanel>

                 <TabPanel value={tabIndex} index={2}>
                    <Grid container spacing={1}>
                        {AVAILABLE_TEMPLATES.map(template => (
                             <ItemButton key={template.name} name={template.name} icon={template.icon} onClick={() => onAddTemplate(template)} />
                        ))}
                    </Grid>
                </TabPanel>
            </Box>
        </Menu>
    );
};

export default AddElementMenu;