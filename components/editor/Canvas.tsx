


import React from 'react';
import { Page, ViewMode, ElementType, Layout, Template, EditorElement } from '../../types';
import RenderedElement from './RenderedElement';
import { Box } from '@mui/material';

interface CanvasProps {
    page: Page;
    viewMode: ViewMode;
    selectedElementId: string | null;
    onSelectElement: (id: string) => void;
    onDeleteElement?: (id: string) => void;
    onMoveElement: (draggedElementId: string, targetContainerId: string, newIndex: number) => void;
    onOpenAddMenu?: (anchorEl: HTMLElement, containerId: string, index: number) => void;
    onDropNewElement?: (itemType: string, itemData: string, targetContainerId: string, index: number) => void;
    onAddElement?: (parentId: string, element: EditorElement, index: number) => void;
    isPreviewing?: boolean;
}

const viewWidths: Record<ViewMode, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
};

const Canvas: React.FC<CanvasProps> = ({ page, viewMode, selectedElementId, onSelectElement, onDeleteElement, onMoveElement, isPreviewing = false, onOpenAddMenu, onDropNewElement, onAddElement }) => {
    const rootElement = page.elements[page.rootElementId];

    return (
        <Box sx={{ 
            flex: 1, 
            width: '100%', 
            height: '100%', 
            p: isPreviewing ? 0 : 2, 
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: isPreviewing ? 'stretch' : 'flex-start',
        }}>
             <Box sx={{ 
                mx: 'auto', 
                bgcolor: 'background.paper', 
                boxShadow: isPreviewing ? 0 : 3, 
                borderRadius: isPreviewing ? 0 : 1, 
                width: viewWidths[viewMode],
                maxWidth: '100%',
                transition: 'width 0.3s ease-in-out',
                height: isPreviewing ? '100%' : 'auto',
                flexShrink: 0,
                }}>
                {rootElement && (
                    <RenderedElement
                        element={rootElement}
                        allElements={page.elements}
                        page={page}
                        rootElementId={page.rootElementId}
                        selectedElementId={isPreviewing ? null : selectedElementId}
                        onSelectElement={onSelectElement}
                        onDeleteElement={onDeleteElement}
                        onMoveElement={onMoveElement}
                        onOpenAddMenu={onOpenAddMenu}
                        onDropNewElement={onDropNewElement}
                        onAddElement={onAddElement}
                        isReadOnly={isPreviewing}
                    />
                )}
            </Box>
        </Box>
    );
};

export default Canvas;