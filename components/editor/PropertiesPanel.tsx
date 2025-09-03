import React, { useState, useEffect } from 'react';
import { EditorElement, ElementType, ContainerProps, TextProps, ButtonProps, ImageProps, InputProps, AnyElementPropKey, StackProps, AccordionProps, AlertProps, GridProps, LinkProps, AvatarProps, ListProps, LinearProgressProps, SwitchProps, Page, ThemeSettings, CarouselProps, HeaderProps, DataGridProps, Template } from '../../types';
import { Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Slider, Paper, Tabs, Tab, SelectChangeEvent, Accordion, AccordionSummary, AccordionDetails, ToggleButtonGroup, ToggleButton, IconButton, Divider, InputAdornment, Stack, Button, FormControlLabel, Switch as MuiSwitch } from '@mui/material';
import { Palette, EditAttributes, CheckCircle, ExpandMore, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatBold, FormatItalic, FormatUnderlined, StrikethroughS, Delete, Save } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { addReusableComponent } from '../../store/projectsSlice';

interface PropertiesPanelProps {
    selectedElement: EditorElement | null;
    page: Page;
    onUpdateProps: (elementId: string, prop: AnyElementPropKey, value: any) => void;
    onUpdateTheme: (theme: ThemeSettings) => void;
}

const PropAccordion: React.FC<{ title: string, children: React.ReactNode, defaultExpanded?: boolean }> = ({ title, children, defaultExpanded = false }) => (
    <Accordion defaultExpanded={defaultExpanded} sx={{ boxShadow: 'none', backgroundImage: 'none', '&:before': { display: 'none' }, '&.Mui-expanded': { margin: 0 } }}>
        <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 1, minHeight: 40, '& .MuiAccordionSummary-content': { my: 0, alignItems: 'center' } }}>
            <Typography variant="body2" fontWeight="medium">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1.5 }}>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
                {children}
            </Box>
        </AccordionDetails>
    </Accordion>
);

const PropItem: React.FC<{ children: React.ReactNode, gridColumn?: string }> = ({ children, gridColumn = 'span 2' }) => (
    <Box sx={{ gridColumn }}>{children}</Box>
);

const SpacingInput: React.FC<{ value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }> = ({ value, onChange }) => (
    <TextField
        size="small"
        variant="standard"
        value={value}
        onChange={onChange}
        sx={{ width: 60, input: { textAlign: 'center' } }}
        onClick={e => e.stopPropagation()}
    />
);

const SpacingEditor: React.FC<{ props: any, onUpdate: (prop: AnyElementPropKey, value: string) => void }> = ({ props, onUpdate }) => {
    return (
        <Stack
            alignItems="center"
            sx={{
                border: '1px dashed',
                borderColor: 'divider',
                p: 1,
                pt: 3, // space for the label
                position: 'relative',
                borderRadius: 1,
            }}
        >
            <Typography variant="caption" sx={{ position: 'absolute', top: 4, left: 8, color: 'text.secondary' }}>Margin</Typography>
            
            <SpacingInput value={props.marginTop || '0px'} onChange={e => onUpdate('marginTop', e.target.value)} />

            <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%', my: 1 }}>
                <SpacingInput value={props.marginLeft || '0px'} onChange={e => onUpdate('marginLeft', e.target.value)} />

                <Stack
                    alignItems="center"
                    sx={{
                        flex: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'action.hover',
                        p: 1,
                        pt: 3, // space for the label
                        position: 'relative',
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="caption" sx={{ position: 'absolute', top: 4, left: 8, color: 'text.secondary' }}>Padding</Typography>

                    <SpacingInput value={props.paddingTop || '0px'} onChange={e => onUpdate('paddingTop', e.target.value)} />

                    <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%', my: 1 }}>
                        <SpacingInput value={props.paddingLeft || '0px'} onChange={e => onUpdate('paddingLeft', e.target.value)} />
                        
                        <Box sx={{ flex: 1, height: 40, bgcolor: 'primary.light', opacity: 0.2, borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }} />

                        <SpacingInput value={props.paddingRight || '0px'} onChange={e => onUpdate('paddingRight', e.target.value)} />
                    </Stack>

                    <SpacingInput value={props.paddingBottom || '0px'} onChange={e => onUpdate('paddingBottom', e.target.value)} />
                </Stack>

                <SpacingInput value={props.marginRight || '0px'} onChange={e => onUpdate('marginRight', e.target.value)} />
            </Stack>

            <SpacingInput value={props.marginBottom || '0px'} onChange={e => onUpdate('marginBottom', e.target.value)} />
        </Stack>
    );
};

const CustomCssEditor: React.FC<{ customCss: { [key: string]: string }, onUpdate: (prop: 'customCss', value: any) => void }> = ({ customCss, onUpdate }) => {
    const properties = customCss ? Object.entries(customCss) : [];

    const handleUpdate = (newProps: [string, string][]) => {
        onUpdate('customCss', Object.fromEntries(newProps));
    };

    const addProp = () => handleUpdate([...properties, ['', '']]);
    const updateProp = (index: number, key: string, value: string) => {
        const newProps = [...properties];
        newProps[index] = [key, value];
        handleUpdate(newProps);
    };
    const removeProp = (index: number) => {
        const newProps = [...properties];
        newProps.splice(index, 1);
        handleUpdate(newProps);
    };

    return (
        <Stack spacing={1}>
            {properties.map(([key, value], i) => (
                <Stack direction="row" spacing={1} key={i}>
                    <TextField size="small" label="Property" value={key} onChange={e => updateProp(i, e.target.value, value)} />
                    <TextField size="small" label="Value" value={value} onChange={e => updateProp(i, key, e.target.value)} />
                    <IconButton size="small" onClick={() => removeProp(i)}><Delete /></IconButton>
                </Stack>
            ))}
            <Button size="small" onClick={addProp}>+ Add Property</Button>
        </Stack>
    );
};


const COLOR_PRESETS = [
    { name: 'Default MUI', primaryColor: '#1976d2', secondaryColor: '#dc004e' },
    { name: 'Ocean Blue', primaryColor: '#0077b6', secondaryColor: '#00b4d8' },
    { name: 'Forest Green', primaryColor: '#2d6a4f', secondaryColor: '#40916c' },
    { name: 'Sunset Orange', primaryColor: '#e55934', secondaryColor: '#fa7921' },
    { name: 'Royal Purple', primaryColor: '#44355B', secondaryColor: '#6A5693' },
    { name: 'Graphite', primaryColor: '#212529', secondaryColor: '#6c757d' },
    { name: 'Teal & Coral', primaryColor: '#008080', secondaryColor: '#FF7F50' },
    { name: 'Rose Gold', primaryColor: '#B76E79', secondaryColor: '#D6AD60' },
];

const FONT_PRESETS = [
    'Roboto, sans-serif',
    'Inter, sans-serif',
    'Poppins, sans-serif',
    'Lato, sans-serif',
    'Arial, sans-serif',
    'Verdana, sans-serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Courier New, monospace',
];


const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedElement, page, onUpdateProps, onUpdateTheme }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const dispatch: AppDispatch = useDispatch();
    const editorProjectId = useSelector((s: RootState) => s.editor.projectId);

    useEffect(() => {
        if (selectedElement) {
            setTabIndex(0);
        }
    }, [selectedElement]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };
    
    const renderStylePanel = () => {
        if (!selectedElement) {
            return (
                 <Box p={2}>
                    <Typography variant="body2" color="text.secondary">Select an element to view its properties.</Typography>
                </Box>
            );
        }

        const buildTemplateFrom = (rootId: string): Template => {
            const queue = [rootId];
            const collected: { [k: string]: EditorElement } = {};
            while (queue.length) {
                const id = queue.shift()!;
                const el = page.elements[id];
                if (!el) continue;
                collected[id] = JSON.parse(JSON.stringify(el));
                const children = (el.props as any).children as string[] | undefined;
                if (children && Array.isArray(children)) queue.push(...children);
            }
            return { name: '', icon: <Save />, rootElementId: rootId, elements: collected };
        };

        const handleSaveAsComponent = () => {
            if (!editorProjectId) return;
            const name = window.prompt('Name for this component?') || '';
            if (!name.trim()) return;
            const template = buildTemplateFrom(selectedElement.id);
            template.name = name.trim();
            dispatch(addReusableComponent({ projectId: editorProjectId, component: { name: template.name, template } }));
        };

        const update = (prop: AnyElementPropKey, value: any) => {
            onUpdateProps(selectedElement.id, prop, value);
        };
        const props = selectedElement.props;
        const isFlex = props.display === 'flex';
        const isContainer = selectedElement.type === ElementType.Container;
        const isStack = selectedElement.type === ElementType.Stack;
        const isTexty = [ElementType.Text, ElementType.Button, ElementType.Link].includes(selectedElement.type);
        const isCarousel = selectedElement.type === ElementType.Carousel;
        const isHeader = selectedElement.type === ElementType.Header;
        const isDataGrid = selectedElement.type === ElementType.DataGrid;

        return (
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                    <Button size="small" variant="outlined" startIcon={<Save />} onClick={handleSaveAsComponent}>
                        Save as Component
                    </Button>
                </Box>
                <PropAccordion title="Layout" defaultExpanded>
                    <PropItem gridColumn="span 2">
                        <FormControl size="small" fullWidth><InputLabel>Display</InputLabel>
                        <Select label="Display" value={props.display || 'block'} onChange={e => update('display', e.target.value)}>
                            <MenuItem value="flex">Flex</MenuItem><MenuItem value="block">Block</MenuItem><MenuItem value="grid">Grid</MenuItem><MenuItem value="inline-block">Inline-Block</MenuItem><MenuItem value="none">None</MenuItem>
                        </Select></FormControl>
                    </PropItem>
                    {isFlex && isContainer && (
                        <>
                            <PropItem gridColumn="span 2">
                                <FormControl size="small" fullWidth><InputLabel>Direction</InputLabel>
                                <Select label="Direction" value={(props as ContainerProps).direction || 'col'} onChange={e => update('direction', e.target.value)}>
                                    <MenuItem value="col">Column</MenuItem><MenuItem value="row">Row</MenuItem>
                                </Select></FormControl>
                            </PropItem>
                            <PropItem gridColumn="span 1">
                                <FormControl size="small" fullWidth><InputLabel>Justify</InputLabel>
                                <Select label="Justify" value={(props as ContainerProps).justify || 'flex-start'} onChange={e => update('justify', e.target.value)}>
                                    {['flex-start', 'center', 'flex-end', 'space-between', 'space-around'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                                </Select></FormControl>
                            </PropItem>
                            <PropItem gridColumn="span 1">
                                <FormControl size="small" fullWidth><InputLabel>Align</InputLabel>
                                <Select label="Align" value={(props as ContainerProps).align || 'stretch'} onChange={e => update('align', e.target.value)}>
                                     {['flex-start', 'center', 'flex-end', 'stretch'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                                </Select></FormControl>
                            </PropItem>
                             <PropItem gridColumn="span 1">
                                <TextField fullWidth label="Gap" size="small" value={(props as ContainerProps).gap || 0} onChange={e => update('gap', parseInt(e.target.value, 10) || 0)} />
                            </PropItem>
                        </>
                    )}
                     {isFlex && isStack && (
                        <>
                            <PropItem gridColumn="span 2">
                                <FormControl size="small" fullWidth><InputLabel>Direction</InputLabel>
                                <Select label="Direction" value={(props as StackProps).direction || 'column'} onChange={e => update('direction', e.target.value)}>
                                    <MenuItem value="column">Column</MenuItem><MenuItem value="row">Row</MenuItem>
                                </Select></FormControl>
                            </PropItem>
                            <PropItem gridColumn="span 1">
                                <FormControl size="small" fullWidth><InputLabel>Justify</InputLabel>
                                <Select label="Justify" value={(props as StackProps).justifyContent || 'flex-start'} onChange={e => update('justifyContent', e.target.value)}>
                                    {['flex-start', 'center', 'flex-end', 'space-between', 'space-around'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                                </Select></FormControl>
                            </PropItem>
                            <PropItem gridColumn="span 1">
                                <FormControl size="small" fullWidth><InputLabel>Align</InputLabel>
                                <Select label="Align" value={(props as StackProps).alignItems || 'stretch'} onChange={e => update('alignItems', e.target.value)}>
                                     {['flex-start', 'center', 'flex-end', 'stretch'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                                </Select></FormControl>
                            </PropItem>
                        </>
                    )}
                    <PropItem><TextField fullWidth label="Width" size="small" value={props.width || 'auto'} onChange={e => update('width', e.target.value)} /></PropItem>
                    <PropItem><TextField fullWidth label="Height" size="small" value={props.height || 'auto'} onChange={e => update('height', e.target.value)} /></PropItem>
                    <PropItem><TextField fullWidth label="Max Width" size="small" value={props.maxWidth || 'none'} onChange={e => update('maxWidth', e.target.value)} /></PropItem>
                    <PropItem><TextField fullWidth label="Min Height" size="small" value={props.minHeight || '0px'} onChange={e => update('minHeight', e.target.value)} /></PropItem>
                </PropAccordion>

                <PropAccordion title="Spacing">
                    <PropItem gridColumn="span 2">
                        <SpacingEditor props={props} onUpdate={update} />
                    </PropItem>
                </PropAccordion>

                {isTexty && (
                    <PropAccordion title="Typography" defaultExpanded>
                        <PropItem gridColumn="span 2">
                            <TextField fullWidth multiline rows={2} label="Content" size="small" value={(props as TextProps).content || (props as ButtonProps).text || ''} onChange={e => update(selectedElement.type === ElementType.Button ? 'text' : 'content', e.target.value)} />
                        </PropItem>
                        <PropItem><TextField fullWidth label="Font Size" size="small" value={(props as TextProps).fontSize || '1rem'} onChange={e => update('fontSize', e.target.value)} /></PropItem>
                        <PropItem><TextField fullWidth label="Color" size="small" value={(props as TextProps).color || ''} onChange={e => update('color', e.target.value)} /></PropItem>
                        <PropItem><TextField fullWidth label="Line Height" size="small" value={(props as TextProps).lineHeight || 'normal'} onChange={e => update('lineHeight', e.target.value)} /></PropItem>
                         <PropItem><TextField fullWidth label="Letter Spacing" size="small" value={(props as TextProps).letterSpacing || 'normal'} onChange={e => update('letterSpacing', e.target.value)} /></PropItem>
                        <PropItem>
                            <FormControl fullWidth size="small"><InputLabel>Weight</InputLabel><Select label="Weight" value={(props as TextProps).fontWeight || 'normal'} onChange={e => update('fontWeight', e.target.value)}>
                                {['100','200','300','400','500','600','700','800','900', 'normal', 'bold'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                            </Select></FormControl>
                        </PropItem>
                        <PropItem gridColumn="span 2">
                            <ToggleButtonGroup size="small" fullWidth>
                                <ToggleButton value="bold" selected={(props as TextProps).fontWeight === 'bold'} onChange={() => update('fontWeight', (props as TextProps).fontWeight === 'bold' ? 'normal' : 'bold')}><FormatBold /></ToggleButton>
                                <ToggleButton value="italic" selected={(props as TextProps).fontStyle === 'italic'} onChange={() => update('fontStyle', (props as TextProps).fontStyle === 'italic' ? 'normal' : 'italic')}><FormatItalic /></ToggleButton>
                                <ToggleButton value="underline" selected={(props as TextProps).textDecoration === 'underline'} onChange={() => update('textDecoration', (props as TextProps).textDecoration === 'underline' ? 'none' : 'underline')}><FormatUnderlined /></ToggleButton>
                                <ToggleButton value="line-through" selected={(props as TextProps).textDecoration === 'line-through'} onChange={() => update('textDecoration', (props as TextProps).textDecoration === 'line-through' ? 'none' : 'line-through')}><StrikethroughS /></ToggleButton>
                            </ToggleButtonGroup>
                        </PropItem>
                         <PropItem gridColumn="span 2">
                             <ToggleButtonGroup size="small" fullWidth value={(props as TextProps).textAlign || 'left'} exclusive onChange={(_, v) => v && update('textAlign', v)}>
                                <ToggleButton value="left"><FormatAlignLeft /></ToggleButton>
                                <ToggleButton value="center"><FormatAlignCenter /></ToggleButton>
                                <ToggleButton value="right"><FormatAlignRight /></ToggleButton>
                            </ToggleButtonGroup>
                        </PropItem>
                    </PropAccordion>
                )}
                 <PropAccordion title="Background">
                     <PropItem><TextField fullWidth label="Color" size="small" value={props.backgroundColor || ''} onChange={e => update('backgroundColor', e.target.value)} /></PropItem>
                     <PropItem><TextField fullWidth label="Image URL" size="small" value={props.backgroundImage || ''} onChange={e => update('backgroundImage', e.target.value)} /></PropItem>
                 </PropAccordion>

                  <PropAccordion title="Border">
                     <PropItem><TextField fullWidth label="Border" size="small" value={props.border || ''} onChange={e => update('border', e.target.value)} placeholder="e.g. 1px solid #000" /></PropItem>
                     <PropItem><TextField fullWidth label="Radius" size="small" value={props.borderRadius || ''} onChange={e => update('borderRadius', e.target.value)} placeholder="e.g. 8px" /></PropItem>
                 </PropAccordion>

                 <PropAccordion title="Effects">
                     <PropItem gridColumn="span 2"><TextField fullWidth label="Box Shadow" size="small" value={props.boxShadow || ''} onChange={e => update('boxShadow', e.target.value)} placeholder="e.g. 0 2px 4px #0000001a" /></PropItem>
                     <PropItem gridColumn="span 2">
                        <Typography gutterBottom variant="body2">Opacity</Typography>
                        <Slider value={props.opacity ?? 1} onChange={(_, v) => update('opacity', v)} step={0.01} min={0} max={1} valueLabelDisplay="auto" />
                    </PropItem>
                 </PropAccordion>

                 {isCarousel && (
                    <PropAccordion title="Carousel Settings" defaultExpanded>
                        <PropItem gridColumn="span 1">
                            <FormControlLabel control={<MuiSwitch checked={(props as CarouselProps).showArrows ?? true} onChange={e => update('showArrows', e.target.checked)} />} label="Show Arrows" />
                        </PropItem>
                        <PropItem gridColumn="span 1">
                            <FormControlLabel control={<MuiSwitch checked={(props as CarouselProps).showDots ?? true} onChange={e => update('showDots', e.target.checked)} />} label="Show Dots" />
                        </PropItem>
                        <PropItem gridColumn="span 2">
                            <FormControlLabel control={<MuiSwitch checked={(props as CarouselProps).autoPlay ?? false} onChange={e => update('autoPlay', e.target.checked)} />} label="Auto Play" />
                        </PropItem>
                        {(props as CarouselProps).autoPlay && (
                            <PropItem gridColumn="span 2">
                                <TextField
                                    fullWidth
                                    label="Interval (ms)"
                                    size="small"
                                    type="number"
                                    value={(props as CarouselProps).interval || 3000}
                                    onChange={e => update('interval', parseInt(e.target.value, 10) || 3000)}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">ms</InputAdornment>,
                                    }}
                                />
                            </PropItem>
                        )}
                    </PropAccordion>
                )}

                {isHeader && (
                    <PropAccordion title="Header Settings" defaultExpanded>
                        <PropItem gridColumn="span 1">
                            <FormControl size="small" fullWidth><InputLabel>Position</InputLabel>
                            <Select label="Position" value={(props as HeaderProps).position || 'static'} onChange={e => update('position', e.target.value)}>
                                {['static', 'relative', 'absolute', 'sticky', 'fixed'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                            </Select></FormControl>
                        </PropItem>
                        <PropItem gridColumn="span 1">
                            <FormControl size="small" fullWidth><InputLabel>Color</InputLabel>
                            <Select label="Color" value={(props as HeaderProps).color || 'default'} onChange={e => update('color', e.target.value)}>
                                {['inherit', 'primary', 'secondary', 'default', 'transparent'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                            </Select></FormControl>
                        </PropItem>
                    </PropAccordion>
                )}

                {isDataGrid && (
                    <PropAccordion title="Data Grid Settings" defaultExpanded>
                        <PropItem gridColumn="span 2">
                            <FormControl size="small" fullWidth><InputLabel>Data Source</InputLabel>
                            <Select
                                label="Data Source"
                                value={(props as DataGridProps).dataSourceId || ''}
                                onChange={e => update('dataSourceId', e.target.value)}
                            >
                                <MenuItem value=""><em>None (use static data)</em></MenuItem>
                                {page.dataSources.map(ds => (
                                    <MenuItem key={ds.id} value={ds.id}>{ds.name}</MenuItem>
                                ))}
                            </Select></FormControl>
                        </PropItem>
                        <PropItem gridColumn="span 2">
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Columns (JSON)"
                                size="small"
                                defaultValue={JSON.stringify((props as DataGridProps).columns || [], null, 2)}
                                onBlur={e => {
                                    try {
                                        const parsed = JSON.parse(e.target.value);
                                        update('columns', parsed);
                                    } catch (err) { /* ignore invalid json */ }
                                }}
                                helperText="Array of {field, headerName}"
                            />
                        </PropItem>
                        <PropItem gridColumn="span 2">
                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                label="Rows (JSON)"
                                size="small"
                                defaultValue={JSON.stringify((props as DataGridProps).rows || [], null, 2)}
                                 onBlur={e => {
                                    try {
                                        const parsed = JSON.parse(e.target.value);
                                        update('rows', parsed);
                                    } catch (err) { /* ignore invalid json */ }
                                }}
                                helperText="Array of objects. Disabled if Data Source is used."
                                disabled={!!(props as DataGridProps).dataSourceId}
                            />
                        </PropItem>
                        <PropItem gridColumn="span 2">
                            <FormControlLabel control={<MuiSwitch checked={(props as DataGridProps).striped ?? true} onChange={e => update('striped', e.target.checked)} />} label="Striped Rows" />
                        </PropItem>
                    </PropAccordion>
                )}

                 <PropAccordion title="Custom CSS">
                    <PropItem gridColumn="span 2">
                        <CustomCssEditor customCss={props.customCss || {}} onUpdate={update} />
                    </PropItem>
                 </PropAccordion>
            </Box>
        );
    }
    
    const renderGlobalThemePanel = () => {
        const currentTheme = page.theme || {};

        const handleRadiusChange = (_event: Event, newValue: number | number[]) => {
            onUpdateTheme({
                ...currentTheme,
                borderRadius: newValue as number,
            });
        };

        const handleSpacingChange = (_event: Event, newValue: number | number[]) => {
            onUpdateTheme({
                ...currentTheme,
                spacingUnit: newValue as number,
            });
        };
        
        const handleFontChange = (event: SelectChangeEvent) => {
             onUpdateTheme({
                ...currentTheme,
                fontFamily: event.target.value as string,
            });
        }

        return (
            <Box p={2}>
                <Typography variant="overline" color="text.secondary" display="block" mb={2}>Color Presets</Typography>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                    {COLOR_PRESETS.map(preset => {
                        const isActive = currentTheme.primaryColor === preset.primaryColor && currentTheme.secondaryColor === preset.secondaryColor;
                        return (
                            <Paper
                                key={preset.name}
                                variant="outlined"
                                onClick={() => onUpdateTheme({ ...currentTheme, primaryColor: preset.primaryColor, secondaryColor: preset.secondaryColor })}
                                sx={{
                                    cursor: 'pointer',
                                    p: 1.5,
                                    position: 'relative',
                                    borderColor: isActive ? 'primary.main' : 'divider',
                                    borderWidth: isActive ? 2 : 1,
                                    '&:hover': {
                                        borderColor: 'primary.light',
                                        boxShadow: 1,
                                    }
                                }}
                            >
                                {isActive && <CheckCircle sx={{ position: 'absolute', top: 4, right: 4, color: 'primary.main' }} fontSize="small" />}
                                <Typography variant="caption" component="div" fontWeight="medium" sx={{ mb: 1, textAlign: 'center' }}>{preset.name}</Typography>
                                <Box display="flex" height={40} borderRadius={1} overflow="hidden">
                                    <Box flex={1} bgcolor={preset.primaryColor} />
                                    <Box flex={1} bgcolor={preset.secondaryColor} />
                                </Box>
                            </Paper>
                        );
                    })}
                </Box>

                <Box mt={4}>
                    <Typography variant="overline" color="text.secondary" display="block" mb={2}>
                        Global Border Radius
                    </Typography>
                    <Box px={1}>
                        <Slider
                            value={currentTheme.borderRadius ?? 8}
                            onChange={handleRadiusChange}
                            step={2}
                            marks
                            min={0}
                            max={24}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                </Box>

                 <Box mt={4}>
                    <Typography variant="overline" color="text.secondary" display="block" mb={2}>
                        Typography & Spacing
                    </Typography>
                     <Box px={1}>
                        <Typography gutterBottom variant="body2">Global Spacing Unit (px)</Typography>
                        <Slider
                            value={currentTheme.spacingUnit ?? 8}
                            onChange={handleSpacingChange}
                            step={1}
                            marks
                            min={4}
                            max={16}
                            valueLabelDisplay="auto"
                        />
                         <FormControl fullWidth size="small" sx={{ mt: 3 }}>
                            <InputLabel>Global Font Family</InputLabel>
                            <Select 
                                label="Global Font Family" 
                                value={currentTheme.fontFamily || 'Roboto, sans-serif'} 
                                onChange={handleFontChange}
                            >
                                {FONT_PRESETS.map(font => <MenuItem key={font} value={font} sx={{fontFamily: font}}>{font.split(',')[0]}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
             <Box sx={{
                flexShrink: 0,
                borderBottom: 1,
                borderColor: 'divider',
            }}>
                 <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Inspector tabs" variant="fullWidth">
                    <Tab icon={<EditAttributes />} label="Style" />
                    <Tab icon={<Palette />} label="Theme" />
                </Tabs>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {tabIndex === 0 && renderStylePanel()}
                {tabIndex === 1 && renderGlobalThemePanel()}
            </Box>
        </Box>
    );
};

export default PropertiesPanel;
