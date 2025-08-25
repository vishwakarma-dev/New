

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page, AnyElementPropKey, EditorElement, ElementType, ViewMode, Template, ThemeSettings, DataSource, Layout, ContainerProps, CarouselProps, SlideProps } from '../types';
import { produce } from 'immer';
import { SLIDE_COMPONENT_DEFINITION } from '../constants';

interface EditorState {
    projectId: string | null;
    currentPageId: string | null;
    history: {
        past: Page[];
        present: Page;
        future: Page[];
    };
    selectedElementId: string | null;
    viewMode: ViewMode;
    isPreviewing: boolean;
}

export const createInitialPage = (pageId: string, pageName: string = 'Landing Page'): Page => {
    const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const rootId = `root-container-${uniqueSuffix}`;
    const headingId = `heading-text-${uniqueSuffix}`;
    const subHeadingId = `subheading-text-${uniqueSuffix}`;
    const buttonContainerId = `button-container-${uniqueSuffix}`;
    const button1Id = `button-get-started-${uniqueSuffix}`;
    const button2Id = `button-learn-more-${uniqueSuffix}`;

    return {
        id: pageId,
        name: pageName,
        theme: {
            primaryColor: '#1976d2',
            secondaryColor: '#dc004e',
            backgroundColor: '#ffffff',
            borderRadius: 8,
            spacingUnit: 8,
            fontFamily: 'Roboto, sans-serif',
        },
        rootElementId: rootId,
        elements: {
            [rootId]: { id: rootId, name: 'Root Container', type: ElementType.Container, props: { children: [headingId, subHeadingId, buttonContainerId], direction: 'col', justify: 'center', align: 'center', gap: 2, backgroundColor: 'background.paper', width: '100%', minHeight: '100vh', paddingTop: '64px', paddingBottom: '64px', paddingLeft: '24px', paddingRight: '24px' }},
            [headingId]: { id: headingId, name: 'Headline', type: ElementType.Text, props: { content: 'Welcome to Your Website', fontSize: '2.5rem', fontWeight: 'bold', color: 'text.primary', textAlign: 'center' }},
            [subHeadingId]: { id: subHeadingId, name: 'Sub-headline', type: ElementType.Text, props: { content: 'This is a page built with the no-code editor. Click on any element to start editing!', fontSize: '1rem', color: 'text.secondary', textAlign: 'center', paddingTop: '16px', paddingBottom: '16px' }},
            [buttonContainerId]: { id: buttonContainerId, name: 'Button Container', type: ElementType.Container, props: { children: [button1Id, button2Id], direction: 'row', justify: 'center', align: 'center', gap: 2 }},
            [button1Id]: { id: button1Id, name: 'Get Started Button', type: ElementType.Button, props: { text: 'Get Started', variant: 'contained', color: 'primary', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '20px', paddingRight: '20px', borderRadius: '8px' }},
            [button2Id]: { id: button2Id, name: 'Learn More Button', type: ElementType.Button, props: { text: 'Learn More', variant: 'outlined', color: 'primary', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '20px', paddingRight: '20px', borderRadius: '8px' }}
        },
        dataSources: [],
    };
};

const initialState: EditorState = {
    projectId: null,
    currentPageId: null,
    history: {
        past: [],
        present: createInitialPage('temp-id', 'Empty Page'),
        future: [],
    },
    selectedElementId: null,
    viewMode: 'desktop',
    isPreviewing: false,
};

const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        initializeEditor: (state, action: PayloadAction<{ projectId: string; page: Page }>) => {
            state.projectId = action.payload.projectId;
            state.currentPageId = action.payload.page.id;
            state.selectedElementId = action.payload.page.rootElementId;
            // Reset history
            state.history.past = [];
            state.history.present = action.payload.page;
            state.history.future = [];
        },
        loadPage: (state, action: PayloadAction<Page>) => {
            state.currentPageId = action.payload.id;
            state.selectedElementId = action.payload.rootElementId;
            // Reset history for the new page
            state.history.past = [];
            state.history.present = action.payload;
            state.history.future = [];
        },
        undo: (state) => {
            const lastPast = state.history.past.pop();
            if (lastPast) {
                state.history.future.unshift(state.history.present);
                state.history.present = lastPast;
                state.selectedElementId = null;
            }
        },
        redo: (state) => {
            const firstFuture = state.history.future.shift();
            if (firstFuture) {
                state.history.past.push(state.history.present);
                state.history.present = firstFuture;
                state.selectedElementId = null;
            }
        },
        togglePreview: (state) => {
            state.isPreviewing = !state.isPreviewing;
        },
        setViewMode: (state, action: PayloadAction<ViewMode>) => {
            state.viewMode = action.payload;
        },
        setSelectedElement: (state, action: PayloadAction<string | null>) => {
            state.selectedElementId = action.payload;
        },
        updateElementProp: (state, action: PayloadAction<{ elementId: string; prop: AnyElementPropKey; value: any }>) => {
            const newPresent = produce(state.history.present, draft => {
                const { elementId, prop, value } = action.payload;
                if (draft.elements[elementId]) {
                    (draft.elements[elementId].props as any)[prop] = value;
                }
            });
            if (newPresent !== state.history.present) {
                state.history.past.push(state.history.present);
                state.history.future = [];
                state.history.present = newPresent;
            }
        },
        updateTheme: (state, action: PayloadAction<ThemeSettings>) => {
            const newPresent = produce(state.history.present, draft => {
                draft.theme = action.payload;
            });
            if (newPresent !== state.history.present) {
                state.history.past.push(state.history.present);
                state.history.future = [];
                state.history.present = newPresent;
            }
        },
        addElement: (state, action: PayloadAction<{ parentId: string, element: EditorElement, index: number }>) => {
            const newPresent = produce(state.history.present, draft => {
                 const { parentId, element, index } = action.payload;
                 draft.elements[element.id] = element;
                 const parent = draft.elements[parentId];
                 if (parent && 'children' in parent.props && Array.isArray(parent.props.children)) {
                     parent.props.children.splice(index, 0, element.id);
                 }

                 // If a new Carousel is added, populate it with some default slides and images
                 if (element.type === ElementType.Carousel) {
                    const carouselElement = draft.elements[element.id] as EditorElement & { props: CarouselProps };
                    if (!carouselElement.props.children) {
                        carouselElement.props.children = [];
                    }

                    // Only add if it's empty. This prevents adding slides to carousels from templates.
                    if (carouselElement.props.children.length === 0) {
                        const timestamp = Date.now();
                        for (let i = 0; i < 3; i++) {
                            const slideId = `el-${timestamp}-slide-${i}`;
                            const imageId = `el-${timestamp}-img-${i}`;
                            
                            const newSlide: EditorElement = {
                                id: slideId,
                                name: 'Slide',
                                type: ElementType.Slide,
                                props: { 
                                    ...SLIDE_COMPONENT_DEFINITION.defaultProps,
                                    children: [imageId]
                                } as SlideProps
                            };
                            const newImage: EditorElement = {
                               id: imageId,
                               name: 'Image',
                               type: ElementType.Image,
                               props: {
                                   src: `https://picsum.photos/seed/${slideId}/800/400`,
                                   alt: `Placeholder image ${i + 1}`,
                                   width: '100%',
                                   height: '100%',
                                   borderRadius: '0px',
                               }
                            };
                            draft.elements[slideId] = newSlide;
                            draft.elements[imageId] = newImage;
                            carouselElement.props.children.push(slideId);
                        }
                    }
                 }
            });

            if (newPresent !== state.history.present) {
                state.history.past.push(state.history.present);
                state.history.future = [];
                state.history.present = newPresent;
                state.selectedElementId = action.payload.element.id;
            }
        },
        deleteElement: (state, action: PayloadAction<{ elementId: string }>) => {
            const { elementId } = action.payload;
        
            if (elementId === state.history.present.rootElementId) {
                console.warn("Cannot delete the root element.");
                return;
            }
        
            const currentPage = state.history.present;
        
            // Helper to find the parent ID, can be used on both regular state and draft state
            const findParentId = (page: Page, elId: string): string | null => {
                for (const id in page.elements) {
                    const el = page.elements[id];
                    if ('children' in el.props && Array.isArray(el.props.children) && el.props.children.includes(elId)) {
                        return id;
                    }
                }
                return null;
            };
            
            // Find parent before producing, to correctly set selection after deletion
            const parentIdOfDeleted = findParentId(currentPage, elementId);
        
            const newPresent = produce(currentPage, draft => {
                if (!draft.elements[elementId]) return;
        
                // 1. Remove from parent's children array
                const parentId = findParentId(draft, elementId);
                if (parentId) {
                    const parent = draft.elements[parentId];
                    if (parent && 'children' in parent.props && Array.isArray(parent.props.children)) {
                        const index = parent.props.children.indexOf(elementId);
                        if (index > -1) {
                            parent.props.children.splice(index, 1);
                        }
                    }
                }
                
                // 2. Recursively delete the element and its descendants
                const recursiveDelete = (elId: string) => {
                    const el = draft.elements[elId];
                    if (!el) return;
        
                    if ('children' in el.props && Array.isArray(el.props.children)) {
                        // IMPORTANT: Iterate over a copy because we're deleting from draft.elements
                        [...el.props.children].forEach(childId => recursiveDelete(childId));
                    }
                    
                    delete draft.elements[elId];
                };
        
                recursiveDelete(elementId);
            });
        
            if (newPresent !== currentPage) {
                state.history.past.push(currentPage);
                state.history.future = [];
                state.history.present = newPresent;
        
                const selectionIsNowInvalid = state.selectedElementId && !newPresent.elements[state.selectedElementId];
                
                if (selectionIsNowInvalid) {
                    state.selectedElementId = parentIdOfDeleted || newPresent.rootElementId;
                }
            }
        },
        moveElement: (state, action: PayloadAction<{ draggedElementId: string; targetContainerId: string; newIndex: number }>) => {
            const { draggedElementId, targetContainerId, newIndex } = action.payload;

            if (draggedElementId === targetContainerId) return;

            const newPresent = produce(state.history.present, draft => {
                // Find the original parent and remove the element from it
                let oldParent: EditorElement | undefined;
                for (const elementId in draft.elements) {
                    const el = draft.elements[elementId];
                    if ('children' in el.props && Array.isArray(el.props.children)) {
                        if (el.props.children.includes(draggedElementId)) {
                            oldParent = el;
                            break;
                        }
                    }
                }

                let oldIndex = -1;
                if (oldParent && 'children' in oldParent.props && Array.isArray(oldParent.props.children)) {
                    const oldParentChildren = oldParent.props.children;
                    oldIndex = oldParentChildren.indexOf(draggedElementId);
                    if (oldIndex > -1) {
                        oldParentChildren.splice(oldIndex, 1);
                    }
                }
                
                // Find the target container and add the element
                const targetContainer = draft.elements[targetContainerId];
                if (targetContainer && 'children' in targetContainer.props && Array.isArray(targetContainer.props.children)) {
                    let insertionIndex = newIndex;
                    // Adjust index if moving within the same container to a later position
                    if (oldParent && oldParent.id === targetContainer.id && oldIndex > -1 && newIndex > oldIndex) {
                        insertionIndex--;
                    }
                    targetContainer.props.children.splice(insertionIndex, 0, draggedElementId);
                }
            });
            
            if (newPresent !== state.history.present) {
                state.history.past.push(state.history.present);
                state.history.future = [];
                state.history.present = newPresent;
                state.selectedElementId = draggedElementId;
            }
        },
        addLayout: (state, action: PayloadAction<{ parentId: string; layout: Layout; index: number }>) => {
            const newPresent = produce(state.history.present, draft => {
                const { parentId, layout, index } = action.payload;
                const { name, rows, cols } = layout;

                const gridId = `grid-${Date.now()}`;
                const childIds: string[] = [];
                const colWidth = 12 / cols;

                // Create child containers
                for (let i = 0; i < rows * cols; i++) {
                    const childId = `cell-${Date.now()}-${i}`;
                    childIds.push(childId);
                    draft.elements[childId] = {
                        id: childId,
                        name: 'Grid Cell',
                        type: ElementType.Container,
                        props: {
                            children: [],
                            padding: 2,
                            backgroundColor: 'grey.100',
                            borderRadius: '4px',
                            xs: 12,
                            sm: colWidth,
                        },
                    };
                }

                // Create grid
                draft.elements[gridId] = {
                    id: gridId,
                    name: name,
                    type: ElementType.Grid,
                    props: {
                        children: childIds,
                        spacing: 2,
                        padding: 0,
                        columns: 12
                    },
                };

                // Add to parent
                const parent = draft.elements[parentId];
                if (parent && 'children' in parent.props && Array.isArray(parent.props.children)) {
                    parent.props.children.splice(index, 0, gridId);
                }

                state.selectedElementId = gridId;
            });

            if (newPresent !== state.history.present) {
                state.history.past.push(state.history.present);
                state.history.future = [];
                state.history.present = newPresent;
            }
        },
        addTemplate: (state, action: PayloadAction<{ parentId: string, template: Template, index: number }>) => {
            const newPresent = produce(state.history.present, draft => {
                const { parentId, template, index } = action.payload;
                const idMap: { [oldId: string]: string } = {};
                const timestamp = Date.now();

                // 1. Create new unique IDs for all template elements
                Object.keys(template.elements).forEach((oldId, elIndex) => {
                    idMap[oldId] = `el-${timestamp}-${elIndex}`;
                });

                // 2. Deep copy and remap elements
                Object.values(template.elements).forEach((oldElement: EditorElement) => {
                    const newId = idMap[oldElement.id];
                    // Use structuredClone for a more robust deep copy
                    const newElement: EditorElement = structuredClone(oldElement);
                    newElement.id = newId;
                    newElement.name = `${newElement.name}`;

                    // Remap children if they exist
                    if ('children' in newElement.props && Array.isArray(newElement.props.children)) {
                        newElement.props.children = newElement.props.children
                            .map(childId => idMap[childId])
                            .filter((id): id is string => !!id);
                    }

                    draft.elements[newId] = newElement;
                });
                
                // 3. Add the template's root to the parent
                const newRootId = idMap[template.rootElementId];
                const parent = draft.elements[parentId];
                if (parent && 'children' in parent.props && Array.isArray(parent.props.children)) {
                    parent.props.children.splice(index, 0, newRootId);
                }

                state.selectedElementId = newRootId; // Select the newly added template
            });

             if (newPresent !== state.history.present) {
                state.history.past.push(state.history.present);
                state.history.future = [];
                state.history.present = newPresent;
             }
        },
        updateCurrentPageData: (state, action: PayloadAction<Page>) => {
            const newPresent = produce(state.history.present, draft => {
                // Replaces the current page data, but keeps the ID
                draft.elements = action.payload.elements;
                draft.rootElementId = action.payload.rootElementId;
                // The name can also be imported
                draft.name = action.payload.name;
            });
             if (newPresent !== state.history.present) {
                state.history.past.push(state.history.present);
                state.history.future = [];
                state.history.present = newPresent;
             }
        },
        addDataSource: (state, action: PayloadAction<DataSource>) => {
            const newPresent = produce(state.history.present, draft => {
                if (!draft.dataSources) {
                    draft.dataSources = [];
                }
                draft.dataSources.push(action.payload);
            });
            if (newPresent !== state.history.present) {
                state.history.past.push(state.history.present);
                state.history.future = [];
                state.history.present = newPresent;
            }
        },
        updateDataSource: (state, action: PayloadAction<Partial<DataSource> & { id: string }>) => {
            const newPresent = produce(state.history.present, draft => {
                const dsIndex = (draft.dataSources || []).findIndex(ds => ds.id === action.payload.id);
                if (dsIndex > -1) {
                    draft.dataSources[dsIndex] = { ...draft.dataSources[dsIndex], ...action.payload };
                }
            });
             if (newPresent !== state.history.present) {
                state.history.past.push(state.history.present);
                state.history.future = [];
                state.history.present = newPresent;
             }
        },
        deleteDataSource: (state, action: PayloadAction<{ id: string }>) => {
            const newPresent = produce(state.history.present, draft => {
                draft.dataSources = (draft.dataSources || []).filter(ds => ds.id !== action.payload.id);
            });
            if (newPresent !== state.history.present) {
                state.history.past.push(state.history.present);
                state.history.future = [];
                state.history.present = newPresent;
            }
        },
    }
});

export const { initializeEditor, loadPage, setViewMode, setSelectedElement, updateElementProp, addElement, deleteElement, addLayout, addTemplate, updateCurrentPageData, undo, redo, togglePreview, moveElement, updateTheme, addDataSource, updateDataSource, deleteDataSource } = editorSlice.actions;
export default editorSlice.reducer;