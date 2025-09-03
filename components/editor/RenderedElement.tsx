import React, { useState, useEffect, useCallback } from 'react';
import { EditorElement, ElementType, ContainerProps, TextProps, ButtonProps, ImageProps, SpacerProps, InputProps, DividerProps, StackProps, CardProps, AccordionProps, AlertProps, GridProps, LinkProps, AvatarProps, ListProps, LinearProgressProps, SwitchProps, Page, CarouselProps, SlideProps, HeaderProps, DataGridProps } from '../../types';
import { Grid, Box, Typography, Button, TextField, Divider, Chip, Stack, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Alert, Link, Avatar, List, LinearProgress, Switch, IconButton, Fab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, AppBar, Toolbar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add as AddIcon, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { SLIDE_COMPONENT_DEFINITION } from '../../constants';

const mapFontSizeToVariant = (fontSize: string | undefined) => {
    if (!fontSize || !isNaN(parseFloat(fontSize))) return undefined; // Return undefined if it's a direct pixel/rem value
    const mapping: { [key: string]: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' } = {
        'h1': 'h1', 'h2': 'h2', 'h3': 'h3', 'h4': 'h4', 'h5': 'h5', 'h6': 'h6',
        'subtitle1': 'subtitle1', 'subtitle2': 'subtitle2',
        'body1': 'body1', 'body2': 'body2',
        'base': 'body1', 'lg': 'h6', 'xl': 'h5', '2xl': 'h4', '3xl': 'h3',
    };
    return mapping[fontSize] || undefined;
};

const DropIndicator: React.FC<{ orientation?: 'vertical' | 'horizontal' }> = ({ orientation = 'horizontal' }) => (
    <Box sx={{
        height: orientation === 'horizontal' ? '4px' : 'auto',
        width: orientation === 'horizontal' ? '100%' : '4px',
        minHeight: orientation === 'vertical' ? '40px' : '4px',
        alignSelf: 'stretch',
        backgroundColor: 'primary.main',
        borderRadius: '2px',
        my: orientation === 'horizontal' ? 0.5 : 0,
        mx: orientation === 'horizontal' ? 0 : 0.5,
        zIndex: 10,
    }} />
);

const AddElementBar: React.FC<{ onClick: (e: React.MouseEvent<HTMLElement>) => void; orientation?: 'vertical' | 'horizontal' }> = ({ onClick, orientation = 'horizontal' }) => (
    <Box sx={{
        height: orientation === 'horizontal' ? '20px' : 'auto',
        width: orientation === 'horizontal' ? '100%' : '20px',
        minHeight: orientation === 'vertical' ? '40px' : '20px',
        alignSelf: 'stretch',
        mx: orientation === 'horizontal' ? 0 : '-10px',
        my: orientation === 'horizontal' ? '-10px' : 0,
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column'
    }}>
        <Box sx={{
            width: orientation === 'horizontal' ? '100%' : '2px',
            height: orientation === 'horizontal' ? '2px' : '100%',
            bgcolor: 'primary.main',
            transition: 'all 0.2s ease-in-out'
        }} />
        <IconButton
            size="small"
            onClick={onClick}
            sx={{
                position: 'absolute',
                bgcolor: 'primary.main',
                color: 'white',
                transition: 'all 0.2s ease-in-out',
                transform: 'scale(0.8)',
                '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'scale(1)',
                }
            }}
            aria-label="Add element here"
        >
            <AddIcon fontSize="small" />
        </IconButton>
    </Box>
);

const getInsertionIndex = (e: React.MouseEvent | React.DragEvent, container: HTMLElement, isVertical: boolean): number => {
    const childrenNodes = Array.from(container.children).filter(child => child.hasAttribute('data-element-id'));
    if (childrenNodes.length === 0) return 0;

    const { clientY, clientX } = e;
    let newIndex = childrenNodes.length;

    for (let i = 0; i < childrenNodes.length; i++) {
        const childNode = childrenNodes[i] as HTMLElement;
        const rect = childNode.getBoundingClientRect();
        if (isVertical) {
            if (clientY < rect.top + rect.height / 2) {
                newIndex = i;
                break;
            }
        } else { // horizontal
            if (clientX < rect.left + rect.width / 2) {
                newIndex = i;
                break;
            }
        }
    }
    return newIndex;
};


interface RenderedElementProps {
    element: EditorElement;
    allElements: { [key: string]: EditorElement };
    page: Page;
    rootElementId: string;
    selectedElementId: string | null;
    onSelectElement: (id: string) => void;
    onDeleteElement?: (id: string) => void;
    onMoveElement: (draggedElementId: string, targetContainerId: string, newIndex: number) => void;
    onOpenAddMenu?: (anchorEl: HTMLElement, containerId: string, index: number) => void;
    onDropNewElement?: (itemType: string, itemData: string, targetContainerId: string, index: number) => void;
    onAddElement?: (parentId: string, element: EditorElement, index: number) => void;
    isReadOnly?: boolean;
}

const RenderedElement: React.FC<RenderedElementProps> = ({ element, allElements, page, selectedElementId, onSelectElement, isReadOnly = false, rootElementId, onDeleteElement, onMoveElement, onOpenAddMenu, onDropNewElement, onAddElement }) => {
    const isSelected = element.id === selectedElementId;
    const theme = useTheme();

    const [isDragOver, setIsDragOver] = useState(false);
    const [dropIndex, setDropIndex] = useState<number | null>(null);
    const [insertionIndex, setInsertionIndex] = useState<number | null>(null);

    const isContainerLike = [
        ElementType.Container, ElementType.Stack, ElementType.Card, ElementType.Accordion, ElementType.Grid, ElementType.List, ElementType.Header, ElementType.Slide
    ].includes(element.type);
    
    const isVertical = (() => {
        if (!isContainerLike) return true;
        switch (element.type) {
            case ElementType.Container:
            case ElementType.Slide:
            case ElementType.Header:
                return (element.props as ContainerProps).direction !== 'row';
            case ElementType.Stack:
                return (element.props as StackProps).direction !== 'row';
            default:
                return true; // Assume vertical for Card, Accordion, Grid, List
        }
    })();

    const handleClick = (e: React.MouseEvent) => {
        if (isReadOnly) return;
        e.stopPropagation();
        onSelectElement(element.id);
    };

    const executeAction = async (a: any) => {
        if (a.type === 'openUrl' && a.params?.url) {
            const target = a.params?.target || '_self';
            window.open(a.params.url, target);
        }
        if (a.type === 'scrollTo' && a.params?.elementId) {
            const targetEl = document.querySelector(`[data-element-id="${a.params.elementId}"]`);
            if (targetEl) {
                const behavior = a.params?.behavior || 'smooth';
                if (typeof a.params?.offset === 'number') {
                    const rect = (targetEl as HTMLElement).getBoundingClientRect();
                    const top = window.scrollY + rect.top - (a.params.offset || 0);
                    window.scrollTo({ top, behavior });
                } else {
                    (targetEl as HTMLElement).scrollIntoView({ behavior, block: 'start' });
                }
            }
        }
        if (a.type === 'copyToClipboard') {
            const text = a.params?.text ?? (document.querySelector(`[data-element-id="${element.id}"]`)?.textContent || '');
            try { await navigator.clipboard.writeText(text); } catch {}
        }
        if (a.type === 'downloadFile' && a.params?.url) {
            const link = document.createElement('a');
            link.href = a.params.url;
            if (a.params?.filename) link.download = a.params.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        if (a.type === 'callWebhook' && a.params?.url) {
            const method = a.params?.method || 'GET';
            const headers = a.params?.headers || {};
            const body = ['GET','HEAD'].includes(method) ? undefined : a.params?.body;
            try { await fetch(a.params.url, { method, headers, body }); } catch {}
        }
        if (a.type === 'tel' && a.params?.phone) {
            window.location.href = `tel:${a.params.phone}`;
        }
        if (a.type === 'mailto' && a.params?.email) {
            const s = encodeURIComponent(a.params.subject || '');
            const b = encodeURIComponent(a.params.body || '');
            window.location.href = `mailto:${a.params.email}?subject=${s}&body=${b}`;
        }
    };

    const triggerActions = (evt: string) => {
        if (!isReadOnly) return;
        const actions = (element.props as any).actions as any[] | undefined;
        if (!actions || actions.length === 0) return;
        actions.filter(a => a.event === evt || (evt === 'onMouseEnter' && a.event === 'onHover')).forEach(executeAction);
    };

    const handleActionClick = (e: React.MouseEvent) => {
        if (!isReadOnly) return;
        triggerActions('onClick');
        e.stopPropagation();
    };

    const handleDelete = (e: React.MouseEvent) => {
        if (isReadOnly || !onDeleteElement) return;
        e.stopPropagation();
        onDeleteElement(element.id);
    };

    const handleDragStart = (e: React.DragEvent) => {
        if (isReadOnly) return;
        e.dataTransfer.setData('elementId', element.id);
        e.dataTransfer.effectAllowed = 'move';
        e.stopPropagation();
        setTimeout(() => {
            (e.target as HTMLElement).style.opacity = '0.4';
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        if (isReadOnly) return;
        (e.target as HTMLElement).style.opacity = '1';
    };

    const handleDragEnter = (e: React.DragEvent) => {
        if (isReadOnly || !isContainerLike) return;
        e.preventDefault(); e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        if (isReadOnly || !isContainerLike) return;
        e.preventDefault(); e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
            setDropIndex(null);
        }
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        if (isReadOnly || !isContainerLike) return;
        e.preventDefault(); e.stopPropagation();

        const draggedId = e.dataTransfer.getData('elementId');
        if (draggedId === element.id) return;
        
        if (e.dataTransfer.types.includes('elementid')) {
            e.dataTransfer.dropEffect = 'move';
        } else if (e.dataTransfer.types.some(t => ['newcomponenttype', 'newlayout', 'newtemplate'].includes(t.toLowerCase()))) {
            e.dataTransfer.dropEffect = 'copy';
        } else {
            e.dataTransfer.dropEffect = 'none';
            return;
        }

        const index = getInsertionIndex(e, e.currentTarget as HTMLElement, isVertical);
        setDropIndex(index);
    };

    const handleDrop = (e: React.DragEvent) => {
        if (isReadOnly || !isContainerLike || dropIndex === null) return;
        e.preventDefault(); e.stopPropagation();
    
        const draggedElementId = e.dataTransfer.getData('elementId');
        const newComponentType = e.dataTransfer.getData('newComponentType');
        const newLayout = e.dataTransfer.getData('newLayout');
        const newTemplate = e.dataTransfer.getData('newTemplate');
    
        const targetContainerId = element.id;
    
        if (draggedElementId) {
            onMoveElement(draggedElementId, targetContainerId, dropIndex);
        } else if (newComponentType && onDropNewElement) {
            onDropNewElement('component', newComponentType, targetContainerId, dropIndex);
        } else if (newLayout && onDropNewElement) {
            onDropNewElement('layout', newLayout, targetContainerId, dropIndex);
        } else if (newTemplate && onDropNewElement) {
            onDropNewElement('template', newTemplate, targetContainerId, dropIndex);
        }
    
        setIsDragOver(false);
        setDropIndex(null);
    };

    const handleContainerMouseMove = (e: React.MouseEvent) => {
        if (isReadOnly || !isContainerLike || !onOpenAddMenu) return;
        e.stopPropagation();
        const index = getInsertionIndex(e, e.currentTarget as HTMLElement, isVertical);
        setInsertionIndex(index);
    }
    
    const handleContainerMouseLeave = (e: React.MouseEvent) => {
        if (isReadOnly || !isContainerLike) return;
        e.stopPropagation();
        setInsertionIndex(null);
    }

    const props = element.props;
    const sx: Record<string, any> = {
        position: 'relative',
        transition: 'all 0.1s ease-in-out',
        outline: !isReadOnly && isSelected ? '2px solid' : 'none',
        outlineColor: 'primary.main',
        outlineOffset: 2,
        '&:hover': !isReadOnly && !isSelected ? {
            outline: '1px dashed',
            outlineColor: 'secondary.light'
        } : {},

        // Layout
        display: props.display,
        // Sizing
        width: props.width,
        height: props.height,
        maxWidth: props.maxWidth,
        minHeight: props.minHeight,
        // Spacing
        marginTop: props.marginTop,
        marginRight: props.marginRight,
        marginBottom: props.marginBottom,
        marginLeft: props.marginLeft,
        paddingTop: props.paddingTop,
        paddingRight: props.paddingRight,
        paddingBottom: props.paddingBottom,
        paddingLeft: props.paddingLeft,
        // Style
        backgroundColor: props.backgroundColor,
        backgroundImage: props.backgroundImage,
        borderRadius: props.borderRadius,
        border: props.border,
        boxShadow: props.boxShadow ?? (props.shadow ? theme.shadows[props.shadow] : undefined),
        opacity: props.opacity,
        
        // Legacy padding support
        p: props.padding,
        
        // Custom CSS from panel
        ...props.customCss,
        // From template definitions
        ...props.sx,
    };
    
    if (isDragOver) {
        sx.outline = '2px dashed';
        sx.outlineColor = 'success.main';
    }

    const commonEventHandlers = {
        onClick: isReadOnly ? handleActionClick : handleClick,
        onDoubleClick: isReadOnly ? () => triggerActions('onDoubleClick') : undefined,
        onMouseEnter: isReadOnly ? () => triggerActions('onMouseEnter') : undefined,
        onMouseLeave: isReadOnly ? () => triggerActions('onMouseLeave') : undefined,
        onMouseOver: isReadOnly ? () => triggerActions('onMouseOver') : undefined,
        onMouseOut: isReadOnly ? () => triggerActions('onMouseOut') : undefined,
        onMouseDown: isReadOnly ? () => triggerActions('onMouseDown') : undefined,
        onMouseUp: isReadOnly ? () => triggerActions('onMouseUp') : undefined,
        onFocus: isReadOnly ? () => triggerActions('onFocus') : undefined,
        onBlur: isReadOnly ? () => triggerActions('onBlur') : undefined,
        onChange: isReadOnly ? () => triggerActions('onChange') : undefined,
        onInput: isReadOnly ? () => triggerActions('onInput') : undefined,
        onKeyDown: isReadOnly ? () => triggerActions('onKeyDown') : undefined,
        onKeyUp: isReadOnly ? () => triggerActions('onKeyUp') : undefined,
        onScroll: isReadOnly ? () => triggerActions('onScroll') : undefined,
        draggable: !isReadOnly,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        'data-element-id': element.id,
    };
    
    const containerEventHandlers = isContainerLike ? {
        onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, onDragOver: handleDragOver, onDrop: handleDrop, onMouseMove: handleContainerMouseMove, onMouseLeave: handleContainerMouseLeave,
    } : {};


    const renderOverlayControls = () => !isReadOnly && isSelected && (
        <>
            <Chip label={element.name} size="small" sx={{position: 'absolute', top: -10, left: -10, zIndex: 10, bgcolor: 'primary.main', color: 'white'}}/>
            {element.id !== rootElementId && onDeleteElement && (
                <IconButton
                    aria-label={`Delete ${element.name}`}
                    onClick={handleDelete}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        zIndex: 10,
                        bgcolor: 'error.main',
                        color: 'white',
                        width: 20,
                        height: 20,
                        '&:hover': { bgcolor: 'error.dark' }
                    }}
                >
                    <DeleteIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
            )}
        </>
    );

    useEffect(() => {
        if (!isReadOnly) return;
        const actions = (element.props as any).actions as any[] | undefined;
        if (!actions || actions.length === 0) return;
        actions.filter(a => a.event === 'onLoad').forEach(executeAction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderChildren = (children: string[] | undefined) => {
        if (!children) return [];
        const childNodes: React.ReactNode[] = [];
        const showAddBar = !isReadOnly && onOpenAddMenu && insertionIndex !== null && !isDragOver;
        const orientation = isVertical ? 'horizontal' : 'vertical';

        const handleAddClick = (index: number) => (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            onOpenAddMenu!(e.currentTarget, element.id, index);
        };

        const addBarAtIndex = (index: number) => showAddBar && insertionIndex === index &&
            <AddElementBar key={`add-${index}`} onClick={handleAddClick(index)} orientation={orientation} />;
        
        const dropIndicatorAtIndex = (index: number) => isDragOver && dropIndex === index &&
            <DropIndicator key={`di-${index}`} orientation={orientation} />;

        childNodes.push(addBarAtIndex(0), dropIndicatorAtIndex(0));

        children.forEach((childId, index) => {
            const childElement = allElements[childId];
            if (childElement) {
                childNodes.push(
                    <RenderedElement
                        key={childId}
                        element={childElement}
                        allElements={allElements}
                        page={page}
                        selectedElementId={selectedElementId}
                        onSelectElement={onSelectElement}
                        isReadOnly={isReadOnly}
                        rootElementId={rootElementId}
                        onDeleteElement={onDeleteElement}
                        onMoveElement={onMoveElement}
                        onOpenAddMenu={onOpenAddMenu}
                        onDropNewElement={onDropNewElement}
                        onAddElement={onAddElement}
                    />
                );
            }
            childNodes.push(addBarAtIndex(index + 1), dropIndicatorAtIndex(index + 1));
        });

        return childNodes.filter(Boolean);
    };

    const renderElement = () => {
        switch (element.type) {
            case ElementType.Container:
                const cProps = props as ContainerProps;
                sx.display = 'flex';
                sx.flexDirection = cProps.direction === 'col' ? 'column' : 'row';
                sx.justifyContent = cProps.justify;
                sx.alignItems = cProps.align;
                sx.gap = cProps.gap;
                sx.minHeight = sx.minHeight || '60px'; // Default min height for empty containers

                return (
                    <Box sx={sx} {...commonEventHandlers} {...containerEventHandlers} className={props.customClass}>
                        {renderOverlayControls()}
                        {renderChildren(cProps.children)}
                    </Box>
                );
            case ElementType.Stack:
                 const stProps = props as StackProps;
                 sx.minHeight = '60px';
                 return (
                    <Stack
                        direction={stProps.direction}
                        spacing={stProps.spacing}
                        justifyContent={stProps.justifyContent}
                        alignItems={stProps.alignItems}
                        sx={sx}
                        {...commonEventHandlers}
                        {...containerEventHandlers}
                        className={props.customClass}
                    >
                        {renderOverlayControls()}
                        {renderChildren(stProps.children)}
                    </Stack>
                 )
            case ElementType.Card:
                const cardProps = props as CardProps;
                return (
                    <Card sx={sx} {...commonEventHandlers} className={props.customClass}>
                        {renderOverlayControls()}
                        <CardContent {...containerEventHandlers}>
                             {renderChildren(cardProps.children)}
                        </CardContent>
                    </Card>
                )
             case ElementType.Accordion:
                const accProps = props as AccordionProps;
                return (
                    <Accordion sx={sx} {...commonEventHandlers} className={props.customClass}>
                         {renderOverlayControls()}
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{accProps.summaryText}</Typography>
                        </AccordionSummary>
                        <AccordionDetails {...containerEventHandlers}>
                            {renderChildren(accProps.children)}
                        </AccordionDetails>
                    </Accordion>
                )
             case ElementType.Alert:
                 const alertProps = props as AlertProps;
                 return (
                    <Box position="relative" {...commonEventHandlers}>
                        {renderOverlayControls()}
                        <Alert severity={alertProps.severity} sx={sx} className={props.customClass}>{alertProps.message}</Alert>
                    </Box>
                 )
            case ElementType.Text:
                const tProps = props as TextProps;
                sx.color = tProps.color;
                sx.fontWeight = tProps.fontWeight;
                sx.textAlign = tProps.textAlign;
                sx.lineHeight = tProps.lineHeight;
                sx.letterSpacing = tProps.letterSpacing;
                sx.fontStyle = tProps.fontStyle;
                sx.textDecoration = tProps.textDecoration;
                const variant = mapFontSizeToVariant(tProps.fontSize);
                if(!variant) sx.fontSize = tProps.fontSize;


                return (
                    <Box position="relative" {...commonEventHandlers}>
                        {renderOverlayControls()}
                        <Typography variant={variant} sx={sx} className={props.customClass}>
                            {tProps.content}
                        </Typography>
                    </Box>
                );
            case ElementType.Button:
                const bProps = props as ButtonProps;
                return (
                     <Box position="relative" display="inline-block" {...commonEventHandlers}>
                        {renderOverlayControls()}
                        <Button variant={bProps.variant} color={bProps.color} sx={sx} className={props.customClass}>
                           {bProps.text}
                        </Button>
                    </Box>
                );
            case ElementType.Image:
                const iProps = props as ImageProps;
                sx.height = sx.height || 'auto';
                return (
                    <Box sx={sx} {...commonEventHandlers} className={props.customClass}>
                        {renderOverlayControls()}
                        <Box component="img" src={iProps.src} alt={iProps.alt} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 'inherit' }} />
                    </Box>
                );
            case ElementType.Spacer:
                const sProps = props as SpacerProps;
                sx.height = sx.height || theme.spacing(sProps.height || 4);
                return <Box sx={sx} {...commonEventHandlers} className={props.customClass} />
            case ElementType.Input:
                 const inProps = props as InputProps;
                return (
                    <Box sx={sx} {...commonEventHandlers} className={props.customClass}>
                        {renderOverlayControls()}
                        <TextField fullWidth multiline={inProps.multiline} rows={inProps.rows} type={inProps.inputType} placeholder={inProps.placeholder} variant={inProps.variant} size="small" />
                    </Box>
                )
            case ElementType.Divider:
                return <Divider sx={sx} {...commonEventHandlers} className={props.customClass} />;
            case ElementType.Grid:
                const gProps = props as GridProps;
                sx.minHeight = '60px';
                const childNodes: React.ReactNode[] = [];
                const gChildren = gProps.children || [];
                const showAddBar = !isReadOnly && onOpenAddMenu && insertionIndex !== null && !isDragOver;

                const handleAddClick = (index: number) => (e: React.MouseEvent<HTMLElement>) => {
                    e.stopPropagation();
                    onOpenAddMenu!(e.currentTarget, element.id, index);
                };

                const addBarAtIndex = (index: number) => showAddBar && insertionIndex === index &&
                    <Grid size={{xs:12}} key={`add-${index}`}><AddElementBar onClick={handleAddClick(index)} /></Grid>;
                
                const dropIndicatorAtIndex = (index: number) => isDragOver && dropIndex === index &&
                    <Grid size={{xs:12}} key={`di-${index}`}><DropIndicator /></Grid>;

                childNodes.push(addBarAtIndex(0), dropIndicatorAtIndex(0));

                gChildren.forEach((childId, index) => {
                    const childElement = allElements[childId];
                    if(childElement) {
                        const childProps = childElement.props;
                        childNodes.push(
                            <Grid key={childId} size={{xs: childProps.xs, sm:childProps.sm, md:childProps.md, lg:childProps.lg }} >
                                <RenderedElement
                                    element={childElement}
                                    allElements={allElements}
                                    page={page}
                                    selectedElementId={selectedElementId}
                                    onSelectElement={onSelectElement}
                                    isReadOnly={isReadOnly}
                                    rootElementId={rootElementId}
                                    onDeleteElement={onDeleteElement}
                                    onMoveElement={onMoveElement}
                                    onOpenAddMenu={onOpenAddMenu}
                                    onDropNewElement={onDropNewElement}
                                    onAddElement={onAddElement}
                                />
                            </Grid>
                        );
                    }
                    childNodes.push(addBarAtIndex(index + 1), dropIndicatorAtIndex(index + 1));
                });

                return (
                    <Grid container spacing={gProps.spacing} columns={gProps.columns || 12} alignItems={gProps.alignItems} sx={sx} {...commonEventHandlers} {...containerEventHandlers}>
                        {renderOverlayControls()}
                        {childNodes.filter(Boolean)}
                    </Grid>
                );
            case ElementType.List:
                const lProps = props as ListProps;
                return (
                    <List dense={lProps.dense} sx={sx} {...commonEventHandlers} {...containerEventHandlers} className={props.customClass}>
                        {renderOverlayControls()}
                        {renderChildren(lProps.children)}
                    </List>
                );
            case ElementType.Link:
                const linkProps = props as LinkProps;
                return (
                    <Box position="relative" display="inline-block" {...commonEventHandlers}>
                        {renderOverlayControls()}
                        <Link href={linkProps.href || '#'} sx={{ ...sx, color: linkProps.color }} className={props.customClass}>
                            {linkProps.text}
                        </Link>
                    </Box>
                );
            case ElementType.Avatar:
                const avProps = props as AvatarProps;
                return (
                     <Box position="relative" display="inline-block" {...commonEventHandlers}>
                        {renderOverlayControls()}
                        <Avatar src={avProps.src} alt={avProps.alt} sx={sx} className={props.customClass}>
                            {!avProps.src && avProps.text}
                        </Avatar>
                    </Box>
                );
            case ElementType.LinearProgress:
                const progProps = props as LinearProgressProps;
                return (
                    <Box sx={{...sx, width: '100%'}} {...commonEventHandlers} className={props.customClass}>
                        {renderOverlayControls()}
                        <LinearProgress variant={progProps.variant} value={progProps.value} />
                    </Box>
                );
            case ElementType.Switch:
                const swProps = props as SwitchProps;
                return (
                    <Box position="relative" display="inline-block" {...commonEventHandlers}>
                        {renderOverlayControls()}
                        <Switch checked={swProps.checked || false} sx={{...sx, p: 0}} className={props.customClass} />
                    </Box>
                );
            case ElementType.Header:
                const hProps = props as HeaderProps;
                const appBarSx = { ...sx };
                delete appBarSx.position; // Position is a prop on AppBar, not sx
                return (
                    <AppBar position={hProps.position} color={hProps.color} sx={appBarSx} {...commonEventHandlers} className={props.customClass}>
                        {renderOverlayControls()}
                        <Toolbar {...containerEventHandlers} sx={{display: 'flex', flexDirection: (hProps.direction === 'col' ? 'column' : 'row'), justifyContent: hProps.justify, alignItems: hProps.align, gap: hProps.gap }}>
                            {renderChildren(hProps.children)}
                        </Toolbar>
                    </AppBar>
                );

            case ElementType.Carousel:
                const carProps = props as CarouselProps;
                const [activeStep, setActiveStep] = useState(0);
                const children = (carProps.children || []);
                const maxSteps = children.length;

                const handleNext = useCallback(() => {
                    setActiveStep((prev) => (prev + 1) % (maxSteps || 1));
                }, [maxSteps]);

                const handleBack = () => setActiveStep((prev) => (prev - 1 + maxSteps) % (maxSteps || 1));
                
                useEffect(() => {
                    if (carProps.autoPlay && maxSteps > 1) {
                        const timer = setInterval(handleNext, carProps.interval || 3000);
                        return () => clearInterval(timer);
                    }
                }, [carProps.autoPlay, carProps.interval, maxSteps, handleNext]);


                const handleAddSlide = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (isReadOnly || !onAddElement) return;
                    const newSlide: EditorElement = {
                        id: `el-${Date.now()}`,
                        name: SLIDE_COMPONENT_DEFINITION.name,
                        type: SLIDE_COMPONENT_DEFINITION.type,
                        props: { ...SLIDE_COMPONENT_DEFINITION.defaultProps },
                    };
                    onAddElement(element.id, newSlide, children.length);
                };

                return (
                    <Box sx={{ ...sx, position: 'relative', overflow: 'hidden' }} {...commonEventHandlers} className={props.customClass}>
                        {renderOverlayControls()}
                        
                        {!isReadOnly && isSelected && onAddElement && (
                            <Fab size="small" color="secondary" aria-label="add slide" sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 10 }} onClick={handleAddSlide}>
                                <AddIcon />
                            </Fab>
                        )}

                        {maxSteps > 0 ? (
                            <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                                {children.map((childId, index) => {
                                    const childElement = allElements[childId];
                                    return (
                                        <Box key={childId} sx={{ width: '100%', height: '100%', display: index === activeStep ? 'block' : 'none' }}>
                                            {childElement && <RenderedElement key={childId} element={childElement} allElements={allElements} page={page} selectedElementId={selectedElementId} onSelectElement={onSelectElement} isReadOnly={isReadOnly} rootElementId={rootElementId} onDeleteElement={onDeleteElement} onMoveElement={onMoveElement} onOpenAddMenu={onOpenAddMenu} onDropNewElement={onDropNewElement} onAddElement={onAddElement} />}
                                        </Box>
                                    );
                                })}
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }} {...containerEventHandlers}>
                                <Typography color="text.secondary">Carousel is empty. Select it to add slides.</Typography>
                            </Box>
                        )}

                        {carProps.showArrows && maxSteps > 1 && (
                            <>
                                <IconButton onClick={handleBack} sx={{ position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)', zIndex: 5, bgcolor: 'rgba(0,0,0,0.3)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' } }}><ArrowBackIos sx={{fontSize: '1rem', ml: 1}} /></IconButton>
                                <IconButton onClick={handleNext} sx={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', zIndex: 5, bgcolor: 'rgba(0,0,0,0.3)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' } }}><ArrowForwardIos sx={{fontSize: '1rem'}} /></IconButton>
                            </>
                        )}

                        {carProps.showDots && maxSteps > 1 && (
                            <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
                                {Array.from({ length: maxSteps }).map((_, index) => (
                                    <Box key={index} onClick={() => setActiveStep(index)} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: activeStep === index ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer', border: '1px solid grey' }} />
                                ))}
                            </Stack>
                        )}
                    </Box>
                );

            case ElementType.Slide:
                const slProps = props as SlideProps;
                sx.display = 'flex';
                sx.flexDirection = slProps.direction === 'col' ? 'column' : 'row';
                sx.justifyContent = slProps.justify;
                sx.alignItems = slProps.align;
                sx.gap = slProps.gap;
                sx.minHeight = sx.minHeight || '100%';
                sx.width = '100%';

                return (
                    <Box sx={sx} {...commonEventHandlers} {...containerEventHandlers} className={props.customClass}>
                        {renderOverlayControls()}
                        {renderChildren(slProps.children)}
                    </Box>
                );
            case ElementType.DataGrid:
                const dgProps = props as DataGridProps;
                const dataSource = dgProps.dataSourceId ? page.dataSources.find(ds => ds.id === dgProps.dataSourceId) : null;

                let columns = dgProps.columns || [];
                let rows = dgProps.rows || [];
                let content;

                if (dataSource) {
                    if (dataSource.status === 'loading') {
                        content = <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
                    } else if (dataSource.status === 'error') {
                        content = <Typography color="error" sx={{ p: 2 }}>Error: {dataSource.error}</Typography>;
                    } else if (dataSource.status === 'success' && Array.isArray(dataSource.data)) {
                        rows = dataSource.data;
                    }
                }
                
                return (
                    <Paper variant="outlined" sx={sx} {...commonEventHandlers} className={props.customClass}>
                        {renderOverlayControls()}
                        <Box onClick={(e)=>e.stopPropagation()} onMouseDown={(e)=>e.stopPropagation()}>
                            <CustomDataGrid columns={columns} rows={rows} density={dgProps.density || 'standard'} pageSize={dgProps.pageSize || 10} editable={dgProps.editable ?? true} showToolbar={dgProps.showToolbar ?? true} striped={dgProps.striped} />
                        </Box>
                    </Paper>
                );

            default:
                 return (
                    <Box sx={sx} {...commonEventHandlers} className={props.customClass}>
                        {renderOverlayControls()}
                        <Typography>Unknown Element</Typography>
                    </Box>
                );
        }
    };

    return renderElement();
};

export default RenderedElement;
