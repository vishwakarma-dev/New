import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ElementType, Template, Layout } from '../../types';
import { AVAILABLE_COMPONENTS, AVAILABLE_TEMPLATES } from '../../constants';
import { APP_COMPONENT_CATEGORIES, getComponentsByCategory } from '../../lib/componentCategories';
import { Widgets, GridView, ViewQuilt, ExpandMore, Apps } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`palette-tabpanel-${index}`}
      aria-labelledby={`palette-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1.5, maxHeight: 'calc(100vh - 144px)', overflowY: 'auto' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DraggableItem: React.FC<{ name: string; icon: React.ReactNode; onDragStart: (e: React.DragEvent) => void; }> = ({ name, icon, onDragStart }) => {
    return (
        <Grid xs={6}>
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
                        color : "primary.main",
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
  { name: '3x3 Grid', rows: 3, cols: 3, icon: <LayoutIcon rows={3} cols={3} /> },
  { name: '4x4 Grid', rows: 4, cols: 4, icon: <LayoutIcon rows={4} cols={4} /> },
];

const ComponentPalette: React.FC = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [expandedCategory, setExpandedCategory] = useState<string>('mobile-native');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleCategoryChange = (categoryId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedCategory(isExpanded ? categoryId : '');
    };

    const handleDragStart = (e: React.DragEvent, type: 'component' | 'layout' | 'template', data: any) => {
        e.dataTransfer.effectAllowed = 'copy';
        if (type === 'component') {
            e.dataTransfer.setData('newComponentType', data);
        } else if (type === 'layout') {
            e.dataTransfer.setData('newLayout', JSON.stringify(data));
        } else if (type === 'template') {
            e.dataTransfer.setData('newTemplate', JSON.stringify(data));
        }
    };

    return (
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Component palette tabs" variant="scrollable" scrollButtons="auto">
                    <Tab icon={<Apps />} iconPosition="start" label="App Components" id="palette-tab-0" sx={{minHeight: 48}} />
                    <Tab icon={<Widgets />} iconPosition="start" label="All Components" id="palette-tab-1" sx={{minHeight: 48}} />
                    <Tab icon={<GridView />} iconPosition="start" label="Layouts" id="palette-tab-2" sx={{minHeight: 48}} />
                    <Tab icon={<ViewQuilt />} iconPosition="start" label="Templates" id="palette-tab-3" sx={{minHeight: 48}} />
                </Tabs>
            </Box>

            {/* Categorized App Components Tab */}
            <TabPanel value={tabIndex} index={0}>
                <Box sx={{ maxHeight: 'calc(100vh - 180px)', overflowY: 'auto' }}>
                    {APP_COMPONENT_CATEGORIES.map((category) => {
                        const categoryComponents = getComponentsByCategory(category.id);
                        const availableComponents = AVAILABLE_COMPONENTS.filter(comp =>
                            categoryComponents.includes(comp.type)
                        );

                        if (availableComponents.length === 0) return null;

                        return (
                            <Accordion
                                key={category.id}
                                expanded={expandedCategory === category.id}
                                onChange={handleCategoryChange(category.id)}
                                sx={{ mb: 1, '&:before': { display: 'none' } }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    sx={{
                                        bgcolor: 'grey.50',
                                        borderLeft: 4,
                                        borderLeftColor: category.color,
                                        '&:hover': { bgcolor: 'grey.100' }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                                        <Box sx={{ color: category.color, display: 'flex', alignItems: 'center' }}>
                                            {category.icon}
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="medium">
                                                {category.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {category.description}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={availableComponents.length}
                                            size="small"
                                            sx={{ bgcolor: category.color, color: 'white', minWidth: 24 }}
                                        />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 1 }}>
                                    <Grid container spacing={1.5}>
                                        {availableComponents.map(comp => (
                                            <DraggableItem
                                                key={comp.type}
                                                name={comp.name}
                                                icon={comp.icon}
                                                onDragStart={(e) => handleDragStart(e, 'component', comp.type)}
                                            />
                                        ))}
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </Box>
            </TabPanel>

            {/* All Components Tab */}
            <TabPanel value={tabIndex} index={1}>
                 <Grid container spacing={1.5}>
                    {AVAILABLE_COMPONENTS.map(comp => (
                        <DraggableItem
                            key={comp.type}
                            name={comp.name}
                            icon={comp.icon}
                            onDragStart={(e) => handleDragStart(e, 'component', comp.type)}
                        />
                    ))}
                </Grid>
            </TabPanel>

            {/* Layouts Tab */}
            <TabPanel value={tabIndex} index={2}>
                 <Grid container spacing={1.5}>
                    {LAYOUTS.map(layout => {
                        const { icon, ...layoutData } = layout;
                        return (
                             <DraggableItem
                                key={layout.name}
                                name={layout.name}
                                icon={icon}
                                onDragStart={(e) => handleDragStart(e, 'layout', layoutData)}
                            />
                        )
                    })}
                 </Grid>
            </TabPanel>

             {/* Templates Tab */}
             <TabPanel value={tabIndex} index={3}>
                <Grid container spacing={1.5}>
                    {AVAILABLE_TEMPLATES.map(template => (
                         <DraggableItem
                            key={template.name}
                            name={template.name}
                            icon={template.icon}
                            onDragStart={(e) => handleDragStart(e, 'template', template)}
                        />
                    ))}
                </Grid>
            </TabPanel>
        </Box>
    );
};

export default ComponentPalette;
