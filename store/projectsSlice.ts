import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project, Page, EditorElement, AppModule } from '../types';
import { createInitialPage } from './editorSlice';
import { ModuleManager, DEFAULT_APP_MODULES } from '../lib/moduleUtils';

interface ProjectsState {
    projects: Project[];
}

const mockProjects: Project[] = [
    {
        id: '1',
        name: 'My First Project',
        description: 'A vibrant and colorful abstract design project, perfect for showcasing creative potential.',
        createdAt: 'Aug 2, 2025',
        imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
        status: 'Active',
        pages: [createInitialPage('page-1', 'Landing Page')],
        projectType: 'web',
        platform: 'react',
        modules: []
    },
    {
        id: '2',
        name: 'Corporate Landing Page',
        description: 'A clean and professional design for a business website.',
        createdAt: 'Jul 15, 2025',
        imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
        status: 'New',
        pages: [
            createInitialPage('page-2-home', 'Home'),
            createInitialPage('page-2-about', 'About Us')
        ],
        projectType: 'web',
        platform: 'react',
        modules: []
    },
];


const initialState: ProjectsState = {
    projects: mockProjects,
};

type NewProjectPayload = {
    name: string;
    description: string;
    imageUrl: string;
    projectType?: 'web' | 'mobile' | 'desktop' | 'hybrid';
    platform?: 'react' | 'react-native' | 'flutter' | 'pwa';
    modules?: string[]; // Array of module IDs to initialize with
};

type ProjectUpdatePayload = {
    id: string;
    changes: {
        name: string;
        description: string;
        imageUrl: string;
        status: 'Active' | 'Inactive' | 'New';
    }
}

type GeneratedProjectPayload = {
    name: string;
    description: string;
    pages: {
        name: string;
        rootElementId: string;
        elements: EditorElement[];
    }[];
};

type AddModulePayload = {
    projectId: string;
    module: AppModule;
};

type RemoveModulePayload = {
    projectId: string;
    moduleId: string;
};

type UpdateModulePayload = {
    projectId: string;
    moduleId: string;
    changes: Partial<AppModule>;
};

type AssignPageToModulePayload = {
    projectId: string;
    pageId: string;
    moduleId: string;
};

type RemovePageFromModulePayload = {
    projectId: string;
    pageId: string;
    moduleId: string;
};

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        addProject: (state, action: PayloadAction<NewProjectPayload>) => {
            const { name, description, imageUrl } = action.payload;
            const newProjectId = `proj-${Date.now()}`;
            const newPageId = `page-${Date.now()}`;
            const newProject: Project = {
                id: newProjectId,
                name: name,
                description: description || 'No description provided.',
                createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                imageUrl: imageUrl || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
                status: 'New',
                pages: [createInitialPage(newPageId, 'New Page')]
            };
            state.projects.unshift(newProject);
        },
        addGeneratedProject: (state, action: PayloadAction<GeneratedProjectPayload>) => {
            const aiProject = action.payload;
            const newProjectId = `proj-${Date.now()}`;

            const newPages: Page[] = aiProject.pages.map((aiPage, pageIndex) => {
                const newPageId = `page-${Date.now()}-${pageIndex}`;
                const timestampSuffix = `${Date.now()}${pageIndex}`;
                const idMap = new Map<string, string>();
                
                const elementsFromAI = aiPage.elements;
                if (!Array.isArray(elementsFromAI)) {
                    console.error("AI Generation Error: `elements` is not a valid array for page:", aiPage.name);
                    return createInitialPage(newPageId, `${aiPage.name} (Error)`);
                }

                // 1. Create new unique IDs for all AI-generated elements
                elementsFromAI.forEach((oldElement, elIndex) => {
                    if (oldElement && oldElement.id) {
                         idMap.set(oldElement.id, `el-${timestampSuffix}-${elIndex}`);
                    }
                });

                const newElementsMap: { [key: string]: EditorElement } = {};
                
                // 2. Build new elements map with remapped IDs
                elementsFromAI.forEach((oldElement) => {
                    if (!oldElement || !oldElement.id || !idMap.has(oldElement.id)) {
                        console.warn('Skipping element with mismatched or missing ID:', oldElement);
                        return;
                    }
                    
                    const newId = idMap.get(oldElement.id)!;
                    
                    // Deep copy to be safe
                    const newElement = JSON.parse(JSON.stringify(oldElement));
                    newElement.id = newId;

                    // Remap children if they exist
                    if ('children' in newElement.props && Array.isArray(newElement.props.children)) {
                        newElement.props.children = newElement.props.children
                            .map((childId: string) => idMap.get(childId))
                            .filter((id): id is string => !!id);
                    }
                    
                    newElementsMap[newId] = newElement;
                });


                const newRootId = idMap.get(aiPage.rootElementId);

                if (!newRootId || !newElementsMap[newRootId]) {
                    console.error("AI Generation Error: Could not find a valid root element for page:", aiPage.name);
                    return createInitialPage(newPageId, `${aiPage.name} (Error)`);
                }

                return {
                    id: newPageId,
                    name: aiPage.name,
                    rootElementId: newRootId,
                    elements: newElementsMap,
                    theme: {
                        primaryColor: '#1976d2',
                        secondaryColor: '#dc004e',
                        backgroundColor: '#ffffff',
                    },
                    dataSources: [],
                };
            });
            
            const newProject: Project = {
                id: newProjectId,
                name: aiProject.name,
                description: aiProject.description || 'Generated by AI.',
                createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                imageUrl: `https://source.unsplash.com/random/800x600?sig=${Date.now()}`,
                status: 'New',
                pages: newPages.filter(p => p && !p.name.includes('(Error)')),
            };

            if (newProject.pages.length > 0) {
                 state.projects.unshift(newProject);
            }
        },
        deleteProject: (state, action: PayloadAction<string>) => {
            state.projects = state.projects.filter(p => p.id !== action.payload);
        },
        updateProject: (state, action: PayloadAction<ProjectUpdatePayload>) => {
            const projectIndex = state.projects.findIndex(p => p.id === action.payload.id);
            if (projectIndex !== -1) {
                state.projects[projectIndex] = {
                    ...state.projects[projectIndex],
                    ...action.payload.changes
                };
            }
        },
        addPage: (state, action: PayloadAction<{ projectId: string, pageName?: string }>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            if (project) {
                const newPage = createInitialPage(`page-${Date.now()}`, action.payload.pageName || 'Untitled Page');
                project.pages.push(newPage);
            }
        },
        deletePage: (state, action: PayloadAction<{ projectId: string; pageId: string }>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            if (project) {
                if (project.pages.length > 1) {
                    project.pages = project.pages.filter(p => p.id !== action.payload.pageId);
                }
            }
        },
        updatePageName: (state, action: PayloadAction<{ projectId: string; pageId: string; newName: string }>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            if (project) {
                const page = project.pages.find(p => p.id === action.payload.pageId);
                if (page) {
                    page.name = action.payload.newName;
                }
            }
        },
        updatePageContent: (state, action: PayloadAction<{ projectId: string; pageId: string; content: Page }>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            if(project) {
                const pageIndex = project.pages.findIndex(p => p.id === action.payload.pageId);
                if(pageIndex !== -1) {
                    project.pages[pageIndex] = action.payload.content;
                }
            }
        },
    },
});

export const { addProject, deleteProject, updateProject, addPage, deletePage, updatePageName, updatePageContent, addGeneratedProject } = projectsSlice.actions;
export default projectsSlice.reducer;
