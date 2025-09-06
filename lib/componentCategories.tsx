import React, { ReactNode } from 'react';
import { ElementType } from '../types';
import {
    // Category Icons
    PhoneIphone,
    Web,
    DataObject,
    Navigation,
    Assessment,
    Input,
    SmartToy,
    TouchApp,
    ViewModule,
    Widgets,
    // Component Icons
    CheckBoxOutlineBlank,
    TextFields,
    SmartButton,
    Image,
    CreditCard,
    GridOn,
    TableView,
    BarChart,
    Assignment,
    Tab,
    OpenInNew,
    Menu,
    Add,
    Search,
    DateRange,
    StarRate,
    LocalOffer,
    PlayCircle,
    Map,
    QrCode,
} from '@mui/icons-material';

export interface ComponentCategory {
    id: string;
    name: string;
    icon: ReactNode;
    description: string;
    components: ElementType[];
    color: string;
    order: number;
}

export const APP_COMPONENT_CATEGORIES: ComponentCategory[] = [
    {
        id: 'mobile-native',
        name: 'Mobile Native',
        icon: <PhoneIphone />,
        description: 'Mobile-first components for native app feel',
        color: '#2196f3',
        order: 1,
        components: [
            ElementType.AppBar,
            ElementType.NavigationBar,
            ElementType.BottomSheet,
            ElementType.FloatingActionButton,
            ElementType.StatusCard,
            ElementType.SearchBar,
            ElementType.SegmentedControl,
        ]
    },
    {
        id: 'layout-structure',
        name: 'Layout & Structure',
        icon: <ViewModule />,
        description: 'Foundation components for app structure',
        color: '#4caf50',
        order: 2,
        components: [
            ElementType.Container,
            ElementType.Stack,
            ElementType.Grid,
            ElementType.Card,
            ElementType.Header,
            ElementType.Divider,
            ElementType.Spacer,
        ]
    },
    {
        id: 'data-display',
        name: 'Data & Analytics',
        icon: <Assessment />,
        description: 'Components for displaying and analyzing data',
        color: '#ff9800',
        order: 3,
        components: [
            ElementType.DataGrid,
            ElementType.Chart,
            ElementType.Timeline,
            ElementType.Stepper,
            ElementType.Badge,
            ElementType.LoadingSpinner,
        ]
    },
    {
        id: 'forms-input',
        name: 'Forms & Input',
        icon: <Input />,
        description: 'User input and form components',
        color: '#9c27b0',
        order: 4,
        components: [
            ElementType.Form,
            ElementType.Input,
            ElementType.SearchBar,
            ElementType.DatePicker,
            ElementType.TimePicker,
            ElementType.FileUpload,
            ElementType.Slider,
            ElementType.Switch,
            ElementType.Rating,
        ]
    },
    {
        id: 'navigation-flow',
        name: 'Navigation & Flow',
        icon: <Navigation />,
        description: 'Components for app navigation and user flow',
        color: '#e91e63',
        order: 5,
        components: [
            ElementType.Tabs,
            ElementType.Modal,
            ElementType.Drawer,
            ElementType.Accordion,
            ElementType.Stepper,
            ElementType.Button,
            ElementType.Link,
        ]
    },
    {
        id: 'interactive',
        name: 'Interactive Elements',
        icon: <TouchApp />,
        description: 'Engaging interactive components',
        color: '#00bcd4',
        order: 6,
        components: [
            ElementType.Carousel,
            ElementType.Toggle,
            ElementType.SegmentedControl,
            ElementType.Chip,
            ElementType.FloatingActionButton,
            ElementType.Alert,
        ]
    },
    {
        id: 'content-media',
        name: 'Content & Media',
        icon: <Widgets />,
        description: 'Rich content and media components',
        color: '#795548',
        order: 7,
        components: [
            ElementType.Text,
            ElementType.RichText,
            ElementType.CodeBlock,
            ElementType.LinkPreview,
            ElementType.Image,
            ElementType.VideoPlayer,
            ElementType.Avatar,
            ElementType.QRCode,
            ElementType.MapView,
        ]
    },
    {
        id: 'web-specific',
        name: 'Web Specific',
        icon: <Web />,
        description: 'Components optimized for web applications',
        color: '#607d8b',
        order: 8,
        components: [
            ElementType.List,
            ElementType.LinearProgress,
            ElementType.Slide,
        ]
    }
];

// Get components by category
export function getComponentsByCategory(categoryId: string): ElementType[] {
    const category = APP_COMPONENT_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.components || [];
}

// Get category for a component
export function getCategoryForComponent(componentType: ElementType): ComponentCategory | undefined {
    return APP_COMPONENT_CATEGORIES.find(cat => 
        cat.components.includes(componentType)
    );
}

// Get categories sorted by order
export function getSortedCategories(): ComponentCategory[] {
    return [...APP_COMPONENT_CATEGORIES].sort((a, b) => a.order - b.order);
}

// Get recommended components for different app types
export function getRecommendedComponents(appType: 'mobile' | 'web' | 'desktop' | 'hybrid'): ElementType[] {
    const recommendations = {
        mobile: [
            ElementType.AppBar,
            ElementType.NavigationBar,
            ElementType.BottomSheet,
            ElementType.StatusCard,
            ElementType.FloatingActionButton,
            ElementType.SearchBar,
            ElementType.Form,
            ElementType.Chart,
            ElementType.Timeline,
        ],
        web: [
            ElementType.Header,
            ElementType.DataGrid,
            ElementType.Chart,
            ElementType.Modal,
            ElementType.Tabs,
            ElementType.Form,
            ElementType.Carousel,
            ElementType.Card,
            ElementType.Button,
        ],
        desktop: [
            ElementType.Header,
            ElementType.Drawer,
            ElementType.DataGrid,
            ElementType.Chart,
            ElementType.Tabs,
            ElementType.Modal,
            ElementType.Form,
            ElementType.Timeline,
            ElementType.Stepper,
        ],
        hybrid: [
            ElementType.AppBar,
            ElementType.Header,
            ElementType.NavigationBar,
            ElementType.DataGrid,
            ElementType.Chart,
            ElementType.Modal,
            ElementType.BottomSheet,
            ElementType.Form,
            ElementType.StatusCard,
        ],
    };

    return recommendations[appType] || recommendations.hybrid;
}

// Filter categories based on app context
export function getContextualCategories(
    appType: 'mobile' | 'web' | 'desktop' | 'hybrid',
    moduleType?: 'feature' | 'service' | 'ui' | 'data'
): ComponentCategory[] {
    let categories = getSortedCategories();

    // Filter by app type
    if (appType === 'mobile') {
        // Prioritize mobile-native and hide web-specific for mobile apps
        categories = categories.filter(cat => cat.id !== 'web-specific');
    } else if (appType === 'web') {
        // Show all categories for web apps
    }

    // Filter by module type
    if (moduleType) {
        const relevantCategoryIds = {
            feature: ['mobile-native', 'layout-structure', 'forms-input', 'navigation-flow'],
            service: ['data-display', 'interactive', 'content-media'],
            ui: ['layout-structure', 'interactive', 'content-media', 'navigation-flow'],
            data: ['data-display', 'forms-input', 'layout-structure'],
        };

        const relevantIds = relevantCategoryIds[moduleType];
        if (relevantIds) {
            categories = categories.filter(cat => relevantIds.includes(cat.id));
        }
    }

    return categories;
}

export default APP_COMPONENT_CATEGORIES;
