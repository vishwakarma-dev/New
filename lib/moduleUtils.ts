import { AppModule, Project, Page } from '../types';

// Predefined app modules for quick setup
export const DEFAULT_APP_MODULES: AppModule[] = [
  {
    id: 'auth-module',
    name: 'Authentication',
    description: 'User login, registration, and account management',
    type: 'feature',
    pages: [],
    icon: 'person',
    color: '#2196f3',
    config: {
      providers: ['email', 'google', 'apple'],
      twoFactor: false,
      rememberMe: true
    }
  },
  {
    id: 'dashboard-module',
    name: 'Dashboard',
    description: 'Analytics, charts, and key metrics display',
    type: 'feature',
    pages: [],
    icon: 'dashboard',
    color: '#4caf50',
    config: {
      refreshInterval: 30000,
      autoRefresh: true,
      widgets: ['stats', 'charts', 'recent-activity']
    }
  },
  {
    id: 'profile-module',
    name: 'User Profile',
    description: 'User profile management and settings',
    type: 'feature',
    pages: [],
    dependencies: ['auth-module'],
    icon: 'account_circle',
    color: '#ff9800',
    config: {
      editableFields: ['name', 'email', 'avatar'],
      privacy: 'public'
    }
  },
  {
    id: 'ecommerce-module',
    name: 'E-commerce',
    description: 'Product catalog, cart, and checkout functionality',
    type: 'feature',
    pages: [],
    dependencies: ['auth-module'],
    icon: 'shopping_cart',
    color: '#e91e63',
    config: {
      currency: 'USD',
      paymentMethods: ['credit_card', 'paypal'],
      inventory: true
    }
  },
  {
    id: 'notifications-module',
    name: 'Notifications',
    description: 'Push notifications and in-app messaging',
    type: 'service',
    pages: [],
    icon: 'notifications',
    color: '#9c27b0',
    config: {
      pushEnabled: true,
      emailEnabled: true,
      inApp: true,
      types: ['system', 'marketing', 'social']
    }
  },
  {
    id: 'chat-module',
    name: 'Chat & Messaging',
    description: 'Real-time chat and messaging functionality',
    type: 'feature',
    pages: [],
    dependencies: ['auth-module'],
    icon: 'chat',
    color: '#00bcd4',
    config: {
      realTime: true,
      fileSharing: true,
      groupChat: true,
      encryption: false
    }
  },
  {
    id: 'media-module',
    name: 'Media Management',
    description: 'Image and video upload, storage, and management',
    type: 'service',
    pages: [],
    icon: 'perm_media',
    color: '#795548',
    config: {
      maxFileSize: '10MB',
      allowedTypes: ['image', 'video'],
      cloudStorage: true,
      compression: true
    }
  },
  {
    id: 'analytics-module',
    name: 'Analytics',
    description: 'User behavior tracking and analytics dashboard',
    type: 'service',
    pages: [],
    icon: 'analytics',
    color: '#607d8b',
    config: {
      trackPageViews: true,
      trackEvents: true,
      realTimeData: false,
      retention: '90days'
    }
  },
  {
    id: 'settings-module',
    name: 'App Settings',
    description: 'Application configuration and user preferences',
    type: 'ui',
    pages: [],
    icon: 'settings',
    color: '#9e9e9e',
    config: {
      themes: ['light', 'dark', 'auto'],
      languages: ['en', 'es', 'fr'],
      accessibility: true
    }
  },
  {
    id: 'onboarding-module',
    name: 'Onboarding',
    description: 'User onboarding flow and tutorials',
    type: 'ui',
    pages: [],
    icon: 'school',
    color: '#ff5722',
    config: {
      steps: 3,
      skipable: true,
      interactive: true,
      progress: true
    }
  }
];

// Module utility functions
export class ModuleManager {
  static createModule(
    name: string, 
    description: string, 
    type: AppModule['type'] = 'feature'
  ): AppModule {
    return {
      id: `${name.toLowerCase().replace(/\s+/g, '-')}-module`,
      name,
      description,
      type,
      pages: [],
      icon: 'extension',
      color: '#673ab7',
      config: {}
    };
  }

  static addPageToModule(project: Project, moduleId: string, pageId: string): Project {
    const updatedProject = { ...project };
    
    // Update the page to reference the module
    const pageIndex = updatedProject.pages.findIndex(p => p.id === pageId);
    if (pageIndex !== -1) {
      updatedProject.pages[pageIndex] = {
        ...updatedProject.pages[pageIndex],
        moduleId
      };
    }

    // Add page to module
    if (updatedProject.modules) {
      const moduleIndex = updatedProject.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex !== -1) {
        const module = updatedProject.modules[moduleIndex];
        if (!module.pages.includes(pageId)) {
          updatedProject.modules[moduleIndex] = {
            ...module,
            pages: [...module.pages, pageId]
          };
        }
      }
    }

    return updatedProject;
  }

  static removePageFromModule(project: Project, moduleId: string, pageId: string): Project {
    const updatedProject = { ...project };
    
    // Remove module reference from page
    const pageIndex = updatedProject.pages.findIndex(p => p.id === pageId);
    if (pageIndex !== -1) {
      updatedProject.pages[pageIndex] = {
        ...updatedProject.pages[pageIndex],
        moduleId: undefined
      };
    }

    // Remove page from module
    if (updatedProject.modules) {
      const moduleIndex = updatedProject.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex !== -1) {
        const module = updatedProject.modules[moduleIndex];
        updatedProject.modules[moduleIndex] = {
          ...module,
          pages: module.pages.filter(pid => pid !== pageId)
        };
      }
    }

    return updatedProject;
  }

  static getModulePages(project: Project, moduleId: string): Page[] {
    const module = project.modules?.find(m => m.id === moduleId);
    if (!module) return [];

    return project.pages.filter(page => module.pages.includes(page.id));
  }

  static getOrphanPages(project: Project): Page[] {
    return project.pages.filter(page => !page.moduleId);
  }

  static validateModuleDependencies(project: Project, moduleId: string): boolean {
    const module = project.modules?.find(m => m.id === moduleId);
    if (!module || !module.dependencies) return true;

    const availableModules = project.modules?.map(m => m.id) || [];
    return module.dependencies.every(depId => availableModules.includes(depId));
  }

  static getModulesByType(project: Project, type: AppModule['type']): AppModule[] {
    return project.modules?.filter(m => m.type === type) || [];
  }

  static initializeProjectWithModules(project: Project, selectedModules: string[]): Project {
    const updatedProject = { ...project };
    
    // Add selected default modules
    const modulesToAdd = DEFAULT_APP_MODULES.filter(m => selectedModules.includes(m.id));
    updatedProject.modules = [...(updatedProject.modules || []), ...modulesToAdd];

    // Set project type if not set
    if (!updatedProject.projectType) {
      updatedProject.projectType = 'mobile';
      updatedProject.platform = 'react-native';
    }

    return updatedProject;
  }

  static generateModuleStructure(module: AppModule): { pages: Partial<Page>[] } {
    const modulePages: Partial<Page>[] = [];

    switch (module.type) {
      case 'feature':
        // Generate main page for the feature
        modulePages.push({
          name: `${module.name} Main`,
          pageType: 'screen',
          moduleId: module.id
        });
        
        // Add settings page if configurable
        if (Object.keys(module.config || {}).length > 0) {
          modulePages.push({
            name: `${module.name} Settings`,
            pageType: 'screen',
            moduleId: module.id
          });
        }
        break;

      case 'ui':
        // Generate UI components/screens
        modulePages.push({
          name: `${module.name} Screen`,
          pageType: 'screen',
          moduleId: module.id
        });
        break;

      case 'service':
        // Services typically don't need their own pages
        // but might need a configuration screen
        modulePages.push({
          name: `${module.name} Config`,
          pageType: 'screen',
          moduleId: module.id
        });
        break;

      case 'data':
        // Data modules might need management screens
        modulePages.push({
          name: `${module.name} Management`,
          pageType: 'screen',
          moduleId: module.id
        });
        break;
    }

    return { pages: modulePages };
  }
}

// Helper function to get module-appropriate components
export function getModuleComponents(moduleType: AppModule['type']): string[] {
  const componentsByType = {
    feature: [
      'Container', 'Stack', 'Grid', 'Text', 'Button', 'Card', 'AppBar', 
      'NavigationBar', 'Form', 'Input', 'DataGrid', 'Chart'
    ],
    ui: [
      'Container', 'Stack', 'Text', 'Button', 'Modal', 'Drawer', 'Tabs',
      'Stepper', 'AppBar', 'FloatingActionButton', 'BottomSheet'
    ],
    service: [
      'Container', 'Text', 'StatusCard', 'Chart', 'Timeline', 'LoadingSpinner',
      'Alert', 'Badge', 'LinearProgress'
    ],
    data: [
      'Container', 'DataGrid', 'Chart', 'Form', 'Input', 'SearchBar',
      'StatusCard', 'Chip', 'DatePicker', 'FileUpload'
    ]
  };

  return componentsByType[moduleType] || componentsByType.feature;
}

export default ModuleManager;
