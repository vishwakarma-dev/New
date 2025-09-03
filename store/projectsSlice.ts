import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project, Page, EditorElement, AppModule, Template, Comment } from '../types';
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
        modules: [],
        reusableComponents: [],
        isPublic: false,
        shareId: 'share-1'
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
        modules: [],
        reusableComponents: [],
        isPublic: false,
        shareId: 'share-2'
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
            const { name, description, imageUrl, projectType, platform, modules } = action.payload;
            const newProjectId = `proj-${Date.now()}`;
            const newPageId = `page-${Date.now()}`;

            let newProject: Project = {
                id: newProjectId,
                name: name,
                description: description || 'No description provided.',
                createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                imageUrl: imageUrl || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
                status: 'New',
                pages: [createInitialPage(newPageId, 'New Page')],
                projectType: projectType || 'web',
                platform: platform || 'react',
                modules: [],
                reusableComponents: [],
                isPublic: false,
                shareId: `share-${Date.now()}`
            };

            // Initialize with selected modules if provided
            if (modules && modules.length > 0) {
                newProject = ModuleManager.initializeProjectWithModules(newProject, modules);
            }

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
                reusableComponents: [],
                isPublic: false,
                shareId: `share-${Date.now()}`,
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

        // Reusable Components
        addReusableComponent: (state, action: PayloadAction<{ projectId: string; component: { name: string; template: Template } }>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            if (project) {
                if (!project.reusableComponents) project.reusableComponents = [];
                const { name, template } = action.payload.component;
                const compTemplate: Template = { name, icon: template.icon, rootElementId: template.rootElementId, elements: template.elements };
                project.reusableComponents.push(compTemplate);
            }
        },
        removeReusableComponent: (state, action: PayloadAction<{ projectId: string; name: string }>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            if (project && project.reusableComponents) {
                project.reusableComponents = project.reusableComponents.filter(c => c.name !== action.payload.name);
            }
        },

        // Comments
        addComment: (state, action: PayloadAction<{ projectId: string; pageId: string; comment: Comment }>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            const page = project?.pages.find(pg => pg.id === action.payload.pageId);
            if (page) {
                if (!page.comments) page.comments = [];
                page.comments.push(action.payload.comment);
            }
        },
        updateComment: (state, action: PayloadAction<{ projectId: string; pageId: string; commentId: string; changes: Partial<Comment> }>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            const page = project?.pages.find(pg => pg.id === action.payload.pageId);
            if (page && page.comments) {
                const idx = page.comments.findIndex(c => c.id === action.payload.commentId);
                if (idx !== -1) {
                    page.comments[idx] = { ...page.comments[idx], ...action.payload.changes };
                }
            }
        },
        deleteComment: (state, action: PayloadAction<{ projectId: string; pageId: string; commentId: string }>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            const page = project?.pages.find(pg => pg.id === action.payload.pageId);
            if (page && page.comments) {
                page.comments = page.comments.filter(c => c.id !== action.payload.commentId);
            }
        },

        // Version History
        savePageVersion: (state, action: PayloadAction<{ projectId: string; pageId: string; name?: string }>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            const pageIndex = project?.pages.findIndex(pg => pg.id === action.payload.pageId) ?? -1;
            if (project && pageIndex !== -1) {
                const page = project.pages[pageIndex];
                const snapshot: Page = JSON.parse(JSON.stringify(page));
                if (!page.versions) page.versions = [];
                page.versions.push({ id: `ver-${Date.now()}`, name: action.payload.name || `Snapshot ${page.versions.length + 1}`, timestamp: Date.now(), snapshot });
            }
        },
        restorePageVersion: (state, action: PayloadAction<{ projectId: string; pageId: string; versionId: string }>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            const pageIndex = project?.pages.findIndex(pg => pg.id === action.payload.pageId) ?? -1;
            if (project && pageIndex !== -1) {
                const page = project.pages[pageIndex];
                const version = (page.versions || []).find(v => v.id === action.payload.versionId);
                if (version) {
                    const restored = JSON.parse(JSON.stringify(version.snapshot));
                    project.pages[pageIndex] = restored;
                }
            }
        },

        // Sharing
        setProjectSharing: (state, action: PayloadAction<{ projectId: string; isPublic: boolean }>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            if (project) {
                project.isPublic = action.payload.isPublic;
                if (!project.shareId) project.shareId = `share-${Date.now()}`;
            }
        },

        // Module Management Actions
        addModule: (state, action: PayloadAction<AddModulePayload>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            if (project) {
                if (!project.modules) {
                    project.modules = [];
                }
                project.modules.push(action.payload.module);
            }
        },

        removeModule: (state, action: PayloadAction<RemoveModulePayload>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            if (project && project.modules) {
                project.modules = project.modules.filter(m => m.id !== action.payload.moduleId);

                // Remove module reference from pages
                project.pages.forEach(page => {
                    if (page.moduleId === action.payload.moduleId) {
                        page.moduleId = undefined;
                    }
                });
            }
        },

        updateModule: (state, action: PayloadAction<UpdateModulePayload>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            if (project && project.modules) {
                const moduleIndex = project.modules.findIndex(m => m.id === action.payload.moduleId);
                if (moduleIndex !== -1) {
                    project.modules[moduleIndex] = {
                        ...project.modules[moduleIndex],
                        ...action.payload.changes
                    };
                }
            }
        },

        assignPageToModule: (state, action: PayloadAction<AssignPageToModulePayload>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            if (project) {
                // Update page to reference the module
                const page = project.pages.find(p => p.id === action.payload.pageId);
                if (page) {
                    // Remove from previous module if assigned
                    if (page.moduleId && project.modules) {
                        const prevModule = project.modules.find(m => m.id === page.moduleId);
                        if (prevModule) {
                            prevModule.pages = prevModule.pages.filter(pid => pid !== action.payload.pageId);
                        }
                    }

                    page.moduleId = action.payload.moduleId;
                }

                // Add page to new module
                if (project.modules) {
                    const module = project.modules.find(m => m.id === action.payload.moduleId);
                    if (module && !module.pages.includes(action.payload.pageId)) {
                        module.pages.push(action.payload.pageId);
                    }
                }
            }
        },

        removePageFromModule: (state, action: PayloadAction<RemovePageFromModulePayload>) => {
            const project = state.projects.find(p => p.id === action.payload.projectId);
            if (project) {
                // Remove module reference from page
                const page = project.pages.find(p => p.id === action.payload.pageId);
                if (page && page.moduleId === action.payload.moduleId) {
                    page.moduleId = undefined;
                }

                // Remove page from module
                if (project.modules) {
                    const module = project.modules.find(m => m.id === action.payload.moduleId);
                    if (module) {
                        module.pages = module.pages.filter(pid => pid !== action.payload.pageId);
                    }
                }
            }
        },
    },
});

export const {
    addProject,
    deleteProject,
    updateProject,
    addPage,
    deletePage,
    updatePageName,
    updatePageContent,
    addGeneratedProject,
    addReusableComponent,
    removeReusableComponent,
    addComment,
    updateComment,
    deleteComment,
    savePageVersion,
    restorePageVersion,
    setProjectSharing,
    addModule,
    removeModule,
    updateModule,
    assignPageToModule,
    removePageFromModule
} = projectsSlice.actions;
export default projectsSlice.reducer;
