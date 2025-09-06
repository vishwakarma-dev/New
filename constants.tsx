import React from 'react';
import { ElementType, EditorElement, Template, BaseProps, TextProps, SlideProps, ElementProps } from './types';
import {
    CheckBoxOutlineBlank,
    TextFields,
    SmartButton,
    Image,
    SpaceBar,
    Input,
    HorizontalRule,
    ViewModule,
    CreditCard,
    ExpandMore,
    Announcement,
    GridOn,
    Link as LinkIcon,
    Person,
    List as ListIcon,
    LinearScale,
    ToggleOn,
    ViewCarousel,
    Star,
    PriceCheck,
    FormatQuote,
    Email,
    HelpOutline,
    AdsClick,
    Group,
    Collections,
    Info,
    Menu as MenuIcon,
    ViewColumn,
    QueryStats,
    Article,
    ShoppingCart,
    Login,
    ErrorOutline,
    MarkEmailRead,
    CheckCircleOutline,
    Workspaces,
    Business,
    Stairs,
    Grid4x4,
    ViewWeek,
    WebAsset,
    TableView,
    Slideshow,
    // New Advanced Component Icons
    BarChart,
    Assignment,
    Tab,
    OpenInNew,
    Menu,
    SwipeUp,
    Add,
    Tune,
    Search,
    PhoneIphone,
    Navigation,
    Assessment,
    Timeline,
    LinearProgress,
    StarRate,
    LocalOffer,
    Badge,
    ToggleOff,
    Tune as SliderIcon,
    DateRange,
    Schedule,
    CloudUpload,
    Map,
    PlayCircle,
    QrCode,
    Refresh,
} from '@mui/icons-material';


interface ComponentDefinition {
    name: string;
    type: ElementType;
    icon: React.ReactNode;
    defaultProps: EditorElement['props'];
}

interface TypedComponentDefinition<P extends ElementProps> {
    name: string;
    type: ElementType;
    icon: React.ReactNode;
    defaultProps: P;
}

const commonDefaultProps: Partial<BaseProps> = {
    display: 'block',
    width: 'auto',
    height: 'auto',
    maxWidth: 'none',
    minHeight: '0px',
    marginTop: '0px',
    marginRight: '0px',
    marginBottom: '0px',
    marginLeft: '0px',
    paddingTop: '0px',
    paddingRight: '0px',
    paddingBottom: '0px',
    paddingLeft: '0px',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    borderRadius: '0px',
    border: 'none',
    boxShadow: 'none',
    opacity: 1,
    customCss: {},
};

const textDefaultProps: Partial<TextProps> = {
    ...commonDefaultProps,
    textAlign: 'left',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
};

export const AVAILABLE_COMPONENTS: ComponentDefinition[] = [
    { name: 'Container', type: ElementType.Container, icon: <CheckBoxOutlineBlank />, defaultProps: { ...commonDefaultProps, display: 'flex', width: '100%', children: [], direction: 'col', justify: 'flex-start', align: 'stretch', gap: 2, paddingTop: '16px', paddingBottom: '16px', paddingLeft: '16px', paddingRight: '16px' } },
    { name: 'Stack', type: ElementType.Stack, icon: <ViewModule />, defaultProps: { ...commonDefaultProps, display: 'flex', width: '100%', children: [], direction: 'column', spacing: 2, paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px' } },
    { name: 'Grid', type: ElementType.Grid, icon: <GridOn />, defaultProps: { ...commonDefaultProps, display: 'grid', width: '100%', children: [], spacing: 2, paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px' } },
    { name: 'List', type: ElementType.List, icon: <ListIcon />, defaultProps: { ...commonDefaultProps, children: [], dense: false, paddingTop: '8px', paddingBottom: '8px', paddingLeft: '8px', paddingRight: '8px' } },
    { name: 'Text', type: ElementType.Text, icon: <TextFields />, defaultProps: { ...textDefaultProps, content: 'New Text Element', fontSize: '1rem', fontWeight: 'normal', color: 'text.primary' } },
    { name: 'Rich Text', type: ElementType.RichText, icon: <Article />, defaultProps: { ...textDefaultProps, width: '100%', content: '<p>New rich text content</p>' } },
    { name: 'Button', type: ElementType.Button, icon: <SmartButton />, defaultProps: { ...commonDefaultProps, display: 'inline-block', text: 'Click Me', variant: 'contained', color: 'primary', paddingTop: '6px', paddingBottom: '6px', paddingLeft: '16px', paddingRight: '16px', borderRadius: '4px' } },
    { name: 'Link', type: ElementType.Link, icon: <LinkIcon />, defaultProps: { ...textDefaultProps, display: 'inline-block', text: 'Clickable Link', href: '#' } },
    { name: 'Image', type: ElementType.Image, icon: <Image />, defaultProps: { ...commonDefaultProps, width: '100%', src: 'https://picsum.photos/400/200', alt: 'Placeholder image', borderRadius: '8px' } },
    { name: 'Avatar', type: ElementType.Avatar, icon: <Person />, defaultProps: { ...commonDefaultProps, display: 'inline-flex', text: 'U', width: '40px', height: '40px' } },
    { name: 'Input', type: ElementType.Input, icon: <Input />, defaultProps: { ...commonDefaultProps, placeholder: 'Enter text...', variant: 'outlined' } },
    { name: 'Switch', type: ElementType.Switch, icon: <ToggleOn />, defaultProps: { ...commonDefaultProps, display: 'inline-block', checked: true } },
    { name: 'Card', type: ElementType.Card, icon: <CreditCard />, defaultProps: { ...commonDefaultProps, children: [], paddingTop: '16px', paddingBottom: '16px', paddingLeft: '16px', paddingRight: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' } },
    { name: 'Accordion', type: ElementType.Accordion, icon: <ExpandMore />, defaultProps: { ...commonDefaultProps, children: [], summaryText: 'Accordion Title' } },
    { name: 'Alert', type: ElementType.Alert, icon: <Announcement />, defaultProps: { ...commonDefaultProps, message: 'This is an alert.', severity: 'info', borderRadius: '4px' } },
    { name: 'Linear Progress', type: ElementType.LinearProgress, icon: <LinearScale />, defaultProps: { ...commonDefaultProps, value: 75, variant: 'determinate' } },
    { name: 'Spacer', type: ElementType.Spacer, icon: <SpaceBar />, defaultProps: { ...commonDefaultProps, height: 32 } },
    { name: 'Divider', type: ElementType.Divider, icon: <HorizontalRule />, defaultProps: { ...commonDefaultProps, paddingTop: '16px', paddingBottom: '16px' } },
    { 
        name: 'Header', 
        type: ElementType.Header, 
        icon: <WebAsset />, 
        defaultProps: { 
            ...commonDefaultProps, 
            display: 'flex', 
            width: '100%', 
            children: [], 
            direction: 'row', 
            justify: 'space-between', 
            align: 'center', 
            paddingTop: '16px', 
            paddingBottom: '16px',
            paddingLeft: '24px',
            paddingRight: '24px',
            position: 'static', 
            color: 'default',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        } 
    },
    { 
        name: 'Carousel', 
        type: ElementType.Carousel, 
        icon: <ViewCarousel />, 
        defaultProps: { 
            ...commonDefaultProps, 
            width: '100%', 
            height: '400px', 
            children: [], 
            showArrows: true, 
            showDots: true,
            autoPlay: false,
            interval: 3000,
            backgroundColor: 'grey.200'
        } 
    },
    {
        name: 'Data Grid',
        type: ElementType.DataGrid,
        icon: <TableView />,
        defaultProps: {
            ...commonDefaultProps,
            width: '100%',
            striped: true,
            columns: [
                { field: 'id', headerName: 'ID' },
                { field: 'firstName', headerName: 'First Name' },
                { field: 'lastName', headerName: 'Last Name' },
            ],
            rows: [
                { id: 1, firstName: 'John', lastName: 'Doe' },
                { id: 2, firstName: 'Jane', lastName: 'Smith' },
                { id: 3, firstName: 'Peter', lastName: 'Jones' },
            ]
        }
    },

    // ADVANCED APP COMPONENTS
    // Data Visualization
    {
        name: 'Chart',
        type: ElementType.Chart,
        icon: <BarChart />,
        defaultProps: {
            ...commonDefaultProps,
            width: '100%',
            height: '300px',
            type: 'bar',
            title: 'Chart Title',
            legend: true,
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                datasets: [{
                    label: 'Sales',
                    data: [12, 19, 3, 5, 2]
                }]
            }
        }
    },

    // Forms & Input
    {
        name: 'Form',
        type: ElementType.Form,
        icon: <Assignment />,
        defaultProps: {
            ...commonDefaultProps,
            children: [],
            method: 'POST',
            validation: true,
            paddingTop: '16px',
            paddingBottom: '16px',
            paddingLeft: '16px',
            paddingRight: '16px'
        }
    },
    {
        name: 'Search Bar',
        type: ElementType.SearchBar,
        icon: <Search />,
        defaultProps: {
            ...commonDefaultProps,
            placeholder: 'Search...',
            showFilter: true,
            width: '100%'
        }
    },
    {
        name: 'Date Picker',
        type: ElementType.DatePicker,
        icon: <DateRange />,
        defaultProps: {
            ...commonDefaultProps,
            format: 'MM/DD/YYYY',
            disablePast: false,
            disableFuture: false
        }
    },
    {
        name: 'Time Picker',
        type: ElementType.TimePicker,
        icon: <Schedule />,
        defaultProps: {
            ...commonDefaultProps,
            format: '12h'
        }
    },
    {
        name: 'File Upload',
        type: ElementType.FileUpload,
        icon: <CloudUpload />,
        defaultProps: {
            ...commonDefaultProps,
            accept: 'image/*',
            multiple: false,
            dragDrop: true,
            width: '100%'
        }
    },
    {
        name: 'Slider',
        type: ElementType.Slider,
        icon: <SliderIcon />,
        defaultProps: {
            ...commonDefaultProps,
            value: 50,
            min: 0,
            max: 100,
            step: 1,
            marks: false,
            orientation: 'horizontal',
            width: '100%'
        }
    },
    {
        name: 'Rating',
        type: ElementType.Rating,
        icon: <StarRate />,
        defaultProps: {
            ...commonDefaultProps,
            value: 3,
            max: 5,
            readOnly: false,
            size: 'medium'
        }
    },

    // Navigation & Layout
    {
        name: 'Tabs',
        type: ElementType.Tabs,
        icon: <Tab />,
        defaultProps: {
            ...commonDefaultProps,
            children: [],
            variant: 'standard',
            orientation: 'horizontal',
            width: '100%'
        }
    },
    {
        name: 'App Bar',
        type: ElementType.AppBar,
        icon: <PhoneIphone />,
        defaultProps: {
            ...commonDefaultProps,
            children: [],
            title: 'App Title',
            showBackButton: false,
            width: '100%',
            paddingTop: '8px',
            paddingBottom: '8px',
            paddingLeft: '16px',
            paddingRight: '16px'
        }
    },
    {
        name: 'Navigation Bar',
        type: ElementType.NavigationBar,
        icon: <Navigation />,
        defaultProps: {
            ...commonDefaultProps,
            items: [
                { label: 'Home', icon: 'home' },
                { label: 'Search', icon: 'search' },
                { label: 'Profile', icon: 'person' }
            ],
            variant: 'bottom',
            showLabels: true,
            width: '100%'
        }
    },
    {
        name: 'Drawer',
        type: ElementType.Drawer,
        icon: <Menu />,
        defaultProps: {
            ...commonDefaultProps,
            children: [],
            anchor: 'left',
            variant: 'temporary',
            width: '280px'
        }
    },
    {
        name: 'Bottom Sheet',
        type: ElementType.BottomSheet,
        icon: <SwipeUp />,
        defaultProps: {
            ...commonDefaultProps,
            children: [],
            title: 'Bottom Sheet',
            expandable: true,
            width: '100%'
        }
    },
    {
        name: 'Modal',
        type: ElementType.Modal,
        icon: <OpenInNew />,
        defaultProps: {
            ...commonDefaultProps,
            children: [],
            title: 'Modal Title',
            size: 'medium'
        }
    },
    {
        name: 'Stepper',
        type: ElementType.Stepper,
        icon: <Stairs />,
        defaultProps: {
            ...commonDefaultProps,
            steps: ['Step 1', 'Step 2', 'Step 3'],
            activeStep: 0,
            orientation: 'horizontal',
            width: '100%'
        }
    },

    // Interactive Elements
    {
        name: 'Floating Action Button',
        type: ElementType.FloatingActionButton,
        icon: <Add />,
        defaultProps: {
            ...commonDefaultProps,
            icon: 'add',
            color: 'primary',
            size: 'medium',
            position: 'bottom-right'
        }
    },
    {
        name: 'Segmented Control',
        type: ElementType.SegmentedControl,
        icon: <Tune />,
        defaultProps: {
            ...commonDefaultProps,
            options: ['Option 1', 'Option 2', 'Option 3'],
            selected: 0,
            color: 'primary',
            width: '100%'
        }
    },
    {
        name: 'Toggle Group',
        type: ElementType.Toggle,
        icon: <ToggleOff />,
        defaultProps: {
            ...commonDefaultProps,
            options: ['Left', 'Center', 'Right'],
            selected: 'Center',
            exclusive: true
        }
    },

    // Display Components
    {
        name: 'Chip',
        type: ElementType.Chip,
        icon: <LocalOffer />,
        defaultProps: {
            ...commonDefaultProps,
            label: 'Chip Label',
            variant: 'filled',
            color: 'primary',
            deletable: false
        }
    },
    {
        name: 'Badge',
        type: ElementType.Badge,
        icon: <Badge />,
        defaultProps: {
            ...commonDefaultProps,
            children: [],
            content: '4',
            color: 'error',
            variant: 'standard'
        }
    },
    {
        name: 'Status Card',
        type: ElementType.StatusCard,
        icon: <Assessment />,
        defaultProps: {
            ...commonDefaultProps,
            title: 'Status',
            value: '1,234',
            trend: 'up',
            icon: 'trending_up',
            color: 'success',
            paddingTop: '16px',
            paddingBottom: '16px',
            paddingLeft: '16px',
            paddingRight: '16px',
            borderRadius: '8px'
        }
    },
    {
        name: 'Timeline',
        type: ElementType.Timeline,
        icon: <Timeline />,
        defaultProps: {
            ...commonDefaultProps,
            items: [
                { title: 'Event 1', description: 'Description 1', date: '2024-01-01', status: 'completed' },
                { title: 'Event 2', description: 'Description 2', date: '2024-01-02', status: 'active' },
                { title: 'Event 3', description: 'Description 3', date: '2024-01-03', status: 'pending' }
            ],
            orientation: 'vertical',
            width: '100%'
        }
    },

    // Media & Content
    {
        name: 'Video Player',
        type: ElementType.VideoPlayer,
        icon: <PlayCircle />,
        defaultProps: {
            ...commonDefaultProps,
            src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            controls: true,
            autoPlay: false,
            loop: false,
            muted: false,
            width: '100%',
            height: '300px',
            borderRadius: '8px'
        }
    },
    {
        name: 'Map View',
        type: ElementType.MapView,
        icon: <Map />,
        defaultProps: {
            ...commonDefaultProps,
            center: { lat: 37.7749, lng: -122.4194 },
            zoom: 10,
            markers: [
                { lat: 37.7749, lng: -122.4194, title: 'San Francisco' }
            ],
            width: '100%',
            height: '300px',
            borderRadius: '8px'
        }
    },
    {
        name: 'QR Code',
        type: ElementType.QRCode,
        icon: <QrCode />,
        defaultProps: {
            ...commonDefaultProps,
            value: 'https://example.com',
            size: 128,
            level: 'M'
        }
    },
    {
        name: 'Loading Spinner',
        type: ElementType.LoadingSpinner,
        icon: <Refresh />,
        defaultProps: {
            ...commonDefaultProps,
            size: 'medium',
            color: 'primary',
            variant: 'circular'
        }
    }
];

export const SLIDE_COMPONENT_DEFINITION: TypedComponentDefinition<SlideProps> = {
    name: 'Slide',
    type: ElementType.Slide,
    icon: <Slideshow />,
    defaultProps: {
        ...commonDefaultProps,
        display: 'flex',
        width: '100%',
        height: '100%',
        children: [],
        direction: 'col',
        justify: 'center',
        align: 'center',
        paddingTop: '24px',
        paddingBottom: '24px',
        paddingLeft: '24px',
        paddingRight: '24px',
    }
};


export const AVAILABLE_TEMPLATES: Template[] = [
    {
        name: 'Hero Banner',
        icon: <ViewCarousel />,
        rootElementId: 'hero-root',
        elements: {
            'hero-root': { id: 'hero-root', name: 'Hero Container', type: ElementType.Container, props: { children: ['hero-h1', 'hero-p', 'hero-btn'], direction: 'col', justify: 'center', align: 'center', gap: 3, padding: 6, backgroundColor: 'grey.100', borderRadius: '8px' } },
            'hero-h1': { id: 'hero-h1', name: 'Headline', type: ElementType.Text, props: { content: 'Powerful Headline Here', fontSize: 'h3', fontWeight: 'bold' } },
            'hero-p': { id: 'hero-p', name: 'Sub-headline', type: ElementType.Text, props: { content: 'This is a subtitle that explains your value proposition in a few sentences.', fontSize: 'body1', color: 'text.secondary' } },
            'hero-btn': { id: 'hero-btn', name: 'CTA Button', type: ElementType.Button, props: { text: 'Call to Action', variant: 'contained', color: 'primary', padding: 2 } },
        }
    },
    {
        name: 'Feature List',
        icon: <Star />,
        rootElementId: 'features-root',
        elements: {
            'features-root': { id: 'features-root', name: 'Features Grid', type: ElementType.Grid, props: { children: ['feature-1', 'feature-2', 'feature-3'], spacing: 4, padding: 4 } },
            'feature-1': { id: 'feature-1', name: 'Feature Item 1', type: ElementType.Container, props: { children: ['f1-avatar', 'f1-h6', 'f1-p'], direction: 'col', align: 'center', justify: 'center', gap: 1.5, xs: 12, sm: 4 } },
            'f1-avatar': { id: 'f1-avatar', name: 'Feature Icon', type: ElementType.Avatar, props: { text: '1', backgroundColor: 'primary.light' } },
            'f1-h6': { id: 'f1-h6', name: 'Feature Title', type: ElementType.Text, props: { content: 'Feature One', fontSize: 'h6' } },
            'f1-p': { id: 'f1-p', name: 'Feature Description', type: ElementType.Text, props: { content: 'Briefly describe this amazing feature.', color: 'text.secondary' } },
            'feature-2': { id: 'feature-2', name: 'Feature Item 2', type: ElementType.Container, props: { children: ['f2-avatar', 'f2-h6', 'f2-p'], direction: 'col', align: 'center', justify: 'center', gap: 1.5, xs: 12, sm: 4 } },
            'f2-avatar': { id: 'f2-avatar', name: 'Feature Icon', type: ElementType.Avatar, props: { text: '2', backgroundColor: 'primary.light' } },
            'f2-h6': { id: 'f2-h6', name: 'Feature Title', type: ElementType.Text, props: { content: 'Feature Two', fontSize: 'h6' } },
            'f2-p': { id: 'f2-p', name: 'Feature Description', type: ElementType.Text, props: { content: 'Briefly describe this amazing feature.', color: 'text.secondary' } },
            'feature-3': { id: 'feature-3', name: 'Feature Item 3', type: ElementType.Container, props: { children: ['f3-avatar', 'f3-h6', 'f3-p'], direction: 'col', align: 'center', justify: 'center', gap: 1.5, xs: 12, sm: 4 } },
            'f3-avatar': { id: 'f3-avatar', name: 'Feature Icon', type: ElementType.Avatar, props: { text: '3', backgroundColor: 'primary.light' } },
            'f3-h6': { id: 'f3-h6', name: 'Feature Title', type: ElementType.Text, props: { content: 'Feature Three', fontSize: 'h6' } },
            'f3-p': { id: 'f3-p', name: 'Feature Description', type: ElementType.Text, props: { content: 'Briefly describe this amazing feature.', color: 'text.secondary' } },
        }
    },
    // Template 3: Pricing Table
    {
        name: 'Pricing Table',
        icon: <PriceCheck />,
        rootElementId: 'pricing-root',
        elements: {
            'pricing-root': { id: 'pricing-root', name: 'Pricing Grid', type: ElementType.Grid, props: { children: ['price-1', 'price-2', 'price-3'], spacing: 3, padding: 4 } },
            'price-1': { id: 'price-1', name: 'Basic Plan', type: ElementType.Card, props: { children: ['p1-title', 'p1-price', 'p1-divider', 'p1-features', 'p1-button'], xs: 12, md: 4 } },
            'p1-title': { id: 'p1-title', name: 'Plan Title', type: ElementType.Text, props: { content: 'Basic', fontSize: 'h5', fontWeight: 'bold' } },
            'p1-price': { id: 'p1-price', name: 'Plan Price', type: ElementType.Text, props: { content: '$10/mo', fontSize: 'h4' } },
            'p1-divider': { id: 'p1-divider', name: 'Divider', type: ElementType.Divider, props: { padding: 1 } },
            'p1-features': { id: 'p1-features', name: 'Features List', type: ElementType.Text, props: { content: 'Feature A\nFeature B\nFeature C' } },
            'p1-button': { id: 'p1-button', name: 'Choose Plan Button', type: ElementType.Button, props: { text: 'Choose Plan', variant: 'outlined' } },
            'price-2': { id: 'price-2', name: 'Pro Plan', type: ElementType.Card, props: { children: ['p2-title', 'p2-price', 'p2-divider', 'p2-features', 'p2-button'], xs: 12, md: 4, shadow: 8, backgroundColor: 'action.selected' } },
            'p2-title': { id: 'p2-title', name: 'Plan Title', type: ElementType.Text, props: { content: 'Pro (Popular)', fontSize: 'h5', fontWeight: 'bold', color: 'primary.main' } },
            'p2-price': { id: 'p2-price', name: 'Plan Price', type: ElementType.Text, props: { content: '$25/mo', fontSize: 'h4' } },
            'p2-divider': { id: 'p2-divider', name: 'Divider', type: ElementType.Divider, props: { padding: 1 } },
            'p2-features': { id: 'p2-features', name: 'Features List', type: ElementType.Text, props: { content: 'All in Basic\nFeature D\nFeature E' } },
            'p2-button': { id: 'p2-button', name: 'Choose Plan Button', type: ElementType.Button, props: { text: 'Choose Plan', variant: 'contained' } },
            'price-3': { id: 'price-3', name: 'Enterprise Plan', type: ElementType.Card, props: { children: ['p3-title', 'p3-price', 'p3-divider', 'p3-features', 'p3-button'], xs: 12, md: 4 } },
            'p3-title': { id: 'p3-title', name: 'Plan Title', type: ElementType.Text, props: { content: 'Enterprise', fontSize: 'h5', fontWeight: 'bold' } },
            'p3-price': { id: 'p3-price', name: 'Plan Price', type: ElementType.Text, props: { content: '$50/mo', fontSize: 'h4' } },
            'p3-divider': { id: 'p3-divider', name: 'Divider', type: ElementType.Divider, props: { padding: 1 } },
            'p3-features': { id: 'p3-features', name: 'Features List', type: ElementType.Text, props: { content: 'All in Pro\n24/7 Support\nFeature F' } },
            'p3-button': { id: 'p3-button', name: 'Choose Plan Button', type: ElementType.Button, props: { text: 'Choose Plan', variant: 'outlined' } },
        }
    },
    // Template 4: Testimonial
    {
        name: 'Testimonial',
        icon: <FormatQuote />,
        rootElementId: 'testimonial-root',
        elements: {
            'testimonial-root': { id: 'testimonial-root', name: 'Testimonial Section', type: ElementType.Container, props: { children: ['testimonial-avatar', 'testimonial-quote', 'testimonial-name', 'testimonial-role'], direction: 'col', align: 'center', justify: 'center', gap: 2, padding: 4, backgroundColor: 'background.paper', borderRadius: '16px' } },
            'testimonial-avatar': { id: 'testimonial-avatar', name: 'Avatar', type: ElementType.Avatar, props: { src: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', sx: { width: 80, height: 80 } } },
            'testimonial-quote': { id: 'testimonial-quote', name: 'Quote', type: ElementType.Text, props: { content: '"This is the best no-code builder I have ever used. It\'s intuitive, powerful, and beautiful."', fontSize: 'h6', color: 'text.secondary', sx: { fontStyle: 'italic' } } },
            'testimonial-name': { id: 'testimonial-name', name: 'Author Name', type: ElementType.Text, props: { content: 'Jane Doe', fontSize: 'body1', fontWeight: 'bold' } },
            'testimonial-role': { id: 'testimonial-role', name: 'Author Role', type: ElementType.Text, props: { content: 'CEO, Tech Innovations Inc.', fontSize: 'body2', color: 'text.disabled' } },
        }
    },
    // Template 5: Contact Form
    {
        name: 'Contact Form',
        icon: <Email />,
        rootElementId: 'contact-root',
        elements: {
            'contact-root': { id: 'contact-root', name: 'Contact Form Container', type: ElementType.Container, props: { children: ['contact-title', 'contact-name', 'contact-email', 'contact-message', 'contact-submit'], direction: 'col', gap: 2, padding: 4, backgroundColor: 'background.paper', borderRadius: '16px', shadow: 1 } },
            'contact-title': { id: 'contact-title', name: 'Title', type: ElementType.Text, props: { content: 'Get in Touch', fontSize: 'h4', fontWeight: 'bold' } },
            'contact-name': { id: 'contact-name', name: 'Name Input', type: ElementType.Input, props: { placeholder: 'Your Name' } },
            'contact-email': { id: 'contact-email', name: 'Email Input', type: ElementType.Input, props: { placeholder: 'Your Email', inputType: 'email' } },
            'contact-message': { id: 'contact-message', name: 'Message Textarea', type: ElementType.Input, props: { placeholder: 'Your Message', multiline: true, rows: 4 } },
            'contact-submit': { id: 'contact-submit', name: 'Submit Button', type: ElementType.Button, props: { text: 'Send Message', variant: 'contained' } },
        }
    },
    // Template 6: FAQ Section
    {
        name: 'FAQ Section',
        icon: <HelpOutline />,
        rootElementId: 'faq-root',
        elements: {
            'faq-root': { id: 'faq-root', name: 'FAQ Container', type: ElementType.Container, props: { children: ['faq-title', 'faq-item1', 'faq-item2', 'faq-item3'], direction: 'col', gap: 1, padding: 4 } },
            'faq-title': { id: 'faq-title', name: 'Title', type: ElementType.Text, props: { content: 'Frequently Asked Questions', fontSize: 'h4', fontWeight: 'bold', padding: 2 } },
            'faq-item1': { id: 'faq-item1', name: 'FAQ 1', type: ElementType.Accordion, props: { children: ['faq-ans1'], summaryText: 'What is this platform for?' } },
            'faq-ans1': { id: 'faq-ans1', name: 'Answer 1', type: ElementType.Text, props: { content: 'This is a no-code website builder that allows you to create beautiful websites with a drag-and-drop interface.' } },
            'faq-item2': { id: 'faq-item2', name: 'FAQ 2', type: ElementType.Accordion, props: { children: ['faq-ans2'], summaryText: 'Is it free to use?' } },
            'faq-ans2': { id: 'faq-ans2', name: 'Answer 2', type: ElementType.Text, props: { content: 'Yes, there is a free plan with basic features. We also offer premium plans with more advanced capabilities.' } },
            'faq-item3': { id: 'faq-item3', name: 'FAQ 3', type: ElementType.Accordion, props: { children: ['faq-ans3'], summaryText: 'Can I use my own domain?' } },
            'faq-ans3': { id: 'faq-ans3', name: 'Answer 3', type: ElementType.Text, props: { content: 'Absolutely. Custom domains are supported on all our premium plans.' } },
        }
    },
    // Template 7: Call to Action (CTA)
    {
        name: 'Call to Action',
        icon: <AdsClick />,
        rootElementId: 'cta-root-2',
        elements: {
            'cta-root-2': { id: 'cta-root-2', name: 'CTA Section', type: ElementType.Container, props: { children: ['cta-heading-2', 'cta-text-2', 'cta-button-2'], direction: 'col', align: 'center', justify: 'center', gap: 2, padding: 8, backgroundColor: 'primary.dark', borderRadius: '16px' } },
            'cta-heading-2': { id: 'cta-heading-2', name: 'CTA Headline', type: ElementType.Text, props: { content: 'Ready to Build Something Amazing?', fontSize: 'h4', fontWeight: 'bold', color: 'primary.contrastText' } },
            'cta-text-2': { id: 'cta-text-2', name: 'CTA Subtext', type: ElementType.Text, props: { content: 'Start your free trial today. No credit card required.', fontSize: 'h6', color: 'primary.contrastText' } },
            'cta-button-2': { id: 'cta-button-2', name: 'CTA Button', type: ElementType.Button, props: { text: 'Sign Up Free', variant: 'contained', color: 'secondary' } },
        }
    },
    // Template 8: Team Section
    {
        name: 'Team Section',
        icon: <Group />,
        rootElementId: 'team-root',
        elements: {
            'team-root': { id: 'team-root', name: 'Team Grid', type: ElementType.Grid, props: { children: ['team-member-1', 'team-member-2', 'team-member-3', 'team-member-4'], spacing: 3, padding: 4 } },
            'team-member-1': { id: 'team-member-1', name: 'Member 1', type: ElementType.Card, props: { children: ['tm1-img', 'tm1-name', 'tm1-role'], xs: 12, sm: 6, md: 3, padding: 0 } },
            'tm1-img': { id: 'tm1-img', name: 'Member Photo', type: ElementType.Image, props: { src: 'https://i.pravatar.cc/400?u=user1', borderRadius: '0px' } },
            'tm1-name': { id: 'tm1-name', name: 'Member Name', type: ElementType.Text, props: { content: 'Alex Johnson', fontSize: 'h6', padding: 1 } },
            'tm1-role': { id: 'tm1-role', name: 'Member Role', type: ElementType.Text, props: { content: 'Lead Developer', color: 'text.secondary', padding: 1 } },
            'team-member-2': { id: 'team-member-2', name: 'Member 2', type: ElementType.Card, props: { children: ['tm2-img', 'tm2-name', 'tm2-role'], xs: 12, sm: 6, md: 3, padding: 0 } },
            'tm2-img': { id: 'tm2-img', name: 'Member Photo', type: ElementType.Image, props: { src: 'https://i.pravatar.cc/400?u=user2', borderRadius: '0px' } },
            'tm2-name': { id: 'tm2-name', name: 'Member Name', type: ElementType.Text, props: { content: 'Maria Garcia', fontSize: 'h6', padding: 1 } },
            'tm2-role': { id: 'tm2-role', name: 'Member Role', type: ElementType.Text, props: { content: 'UI/UX Designer', color: 'text.secondary', padding: 1 } },
            'team-member-3': { id: 'team-member-3', name: 'Member 3', type: ElementType.Card, props: { children: ['tm3-img', 'tm3-name', 'tm3-role'], xs: 12, sm: 6, md: 3, padding: 0 } },
            'tm3-img': { id: 'tm3-img', name: 'Member Photo', type: ElementType.Image, props: { src: 'https://i.pravatar.cc/400?u=user3', borderRadius: '0px' } },
            'tm3-name': { id: 'tm3-name', name: 'Member Name', type: ElementType.Text, props: { content: 'Chen Wei', fontSize: 'h6', padding: 1 } },
            'tm3-role': { id: 'tm3-role', name: 'Member Role', type: ElementType.Text, props: { content: 'Project Manager', color: 'text.secondary', padding: 1 } },
            'team-member-4': { id: 'team-member-4', name: 'Member 4', type: ElementType.Card, props: { children: ['tm4-img', 'tm4-name', 'tm4-role'], xs: 12, sm: 6, md: 3, padding: 0 } },
            'tm4-img': { id: 'tm4-img', name: 'Member Photo', type: ElementType.Image, props: { src: 'https://i.pravatar.cc/400?u=user4', borderRadius: '0px' } },
            'tm4-name': { id: 'tm4-name', name: 'Member Name', type: ElementType.Text, props: { content: 'Samira Khan', fontSize: 'h6', padding: 1 } },
            'tm4-role': { id: 'tm4-role', name: 'Member Role', type: ElementType.Text, props: { content: 'Marketing Head', color: 'text.secondary', padding: 1 } },
        }
    },
    // Template 9: Image Gallery
    {
        name: 'Image Gallery',
        icon: <Collections />,
        rootElementId: 'gallery-root',
        elements: {
            'gallery-root': { id: 'gallery-root', name: 'Gallery Grid', type: ElementType.Grid, props: { children: ['img1', 'img2', 'img3', 'img4', 'img5', 'img6'], spacing: 1, padding: 2 } },
            'img1': { id: 'img1', name: 'Image 1', type: ElementType.Image, props: { src: 'https://picsum.photos/seed/a/400/300', xs: 12, sm: 6, md: 4, borderRadius: '8px' } },
            'img2': { id: 'img2', name: 'Image 2', type: ElementType.Image, props: { src: 'https://picsum.photos/seed/b/400/300', xs: 12, sm: 6, md: 4, borderRadius: '8px' } },
            'img3': { id: 'img3', name: 'Image 3', type: ElementType.Image, props: { src: 'https://picsum.photos/seed/c/400/300', xs: 12, sm: 6, md: 4, borderRadius: '8px' } },
            'img4': { id: 'img4', name: 'Image 4', type: ElementType.Image, props: { src: 'https://picsum.photos/seed/d/400/300', xs: 12, sm: 6, md: 4, borderRadius: '8px' } },
            'img5': { id: 'img5', name: 'Image 5', type: ElementType.Image, props: { src: 'https://picsum.photos/seed/e/400/300', xs: 12, sm: 6, md: 4, borderRadius: '8px' } },
            'img6': { id: 'img6', name: 'Image 6', type: ElementType.Image, props: { src: 'https://picsum.photos/seed/f/400/300', xs: 12, sm: 6, md: 4, borderRadius: '8px' } },
        }
    },
    // Template 10: Footer
    {
        name: 'Footer',
        icon: <Info />,
        rootElementId: 'footer-root',
        elements: {
            'footer-root': { id: 'footer-root', name: 'Footer Section', type: ElementType.Container, props: { children: ['footer-grid', 'footer-divider', 'footer-copyright'], direction: 'col', padding: 4, backgroundColor: 'grey.900' } },
            'footer-grid': { id: 'footer-grid', name: 'Footer Links Grid', type: ElementType.Grid, props: { children: ['footer-col1', 'footer-col2', 'footer-col3'], spacing: 4 } },
            'footer-col1': { id: 'footer-col1', name: 'Column 1', type: ElementType.Container, props: { children: ['fc1-title', 'fc1-link1', 'fc1-link2'], direction: 'col', gap: 1, xs: 12, sm: 4 } },
            'fc1-title': { id: 'fc1-title', name: 'Title', type: ElementType.Text, props: { content: 'Company', fontWeight: 'bold', color: 'common.white' } },
            'fc1-link1': { id: 'fc1-link1', name: 'Link', type: ElementType.Link, props: { text: 'About Us', color: 'grey.400' } },
            'fc1-link2': { id: 'fc1-link2', name: 'Link', type: ElementType.Link, props: { text: 'Careers', color: 'grey.400' } },
            'footer-col2': { id: 'footer-col2', name: 'Column 2', type: ElementType.Container, props: { children: ['fc2-title', 'fc2-link1', 'fc2-link2'], direction: 'col', gap: 1, xs: 12, sm: 4 } },
            'fc2-title': { id: 'fc2-title', name: 'Title', type: ElementType.Text, props: { content: 'Resources', fontWeight: 'bold', color: 'common.white' } },
            'fc2-link1': { id: 'fc2-link1', name: 'Link', type: ElementType.Link, props: { text: 'Blog', color: 'grey.400' } },
            'fc2-link2': { id: 'fc2-link2', name: 'Link', type: ElementType.Link, props: { text: 'Help Center', color: 'grey.400' } },
            'footer-col3': { id: 'footer-col3', name: 'Column 3', type: ElementType.Container, props: { children: ['fc3-title', 'fc3-link1', 'fc3-link2'], direction: 'col', gap: 1, xs: 12, sm: 4 } },
            'fc3-title': { id: 'fc3-title', name: 'Title', type: ElementType.Text, props: { content: 'Legal', fontWeight: 'bold', color: 'common.white' } },
            'fc3-link1': { id: 'fc3-link1', name: 'Link', type: ElementType.Link, props: { text: 'Privacy Policy', color: 'grey.400' } },
            'fc3-link2': { id: 'fc3-link2', name: 'Link', type: ElementType.Link, props: { text: 'Terms of Service', color: 'grey.400' } },
            'footer-divider': { id: 'footer-divider', name: 'Divider', type: ElementType.Divider, props: { padding: 2, sx: { borderColor: 'grey.700' } } },
            'footer-copyright': { id: 'footer-copyright', name: 'Copyright', type: ElementType.Text, props: { content: '© 2024 Your Company. All Rights Reserved.', color: 'grey.500' } },
        }
    },
     // Template 11: Header/Navbar
    {
        name: 'Header',
        icon: <MenuIcon />,
        rootElementId: 'header-root',
        elements: {
            'header-root': { id: 'header-root', name: 'Header Container', type: ElementType.Container, props: { children: ['header-logo', 'header-nav-links', 'header-cta'], direction: 'row', justify: 'space-between', align: 'center', padding: 2, backgroundColor: 'background.paper', shadow: 1 } },
            'header-logo': { id: 'header-logo', name: 'Logo', type: ElementType.Text, props: { content: 'MyLogo', fontSize: 'h5', fontWeight: 'bold' } },
            'header-nav-links': { id: 'header-nav-links', name: 'Nav Links', type: ElementType.Stack, props: { children: ['nav-link1', 'nav-link2', 'nav-link3'], direction: 'row', spacing: 4 } },
            'nav-link1': { id: 'nav-link1', name: 'Home Link', type: ElementType.Link, props: { text: 'Home' } },
            'nav-link2': { id: 'nav-link2', name: 'About Link', type: ElementType.Link, props: { text: 'About' } },
            'nav-link3': { id: 'nav-link3', name: 'Contact Link', type: ElementType.Link, props: { text: 'Contact' } },
            'header-cta': { id: 'header-cta', name: 'Header CTA', type: ElementType.Button, props: { text: 'Get Started', variant: 'contained' } },
        }
    },
    // Template 12: Two Column (Image Left)
    {
        name: 'Image + Text',
        icon: <ViewColumn />,
        rootElementId: 'two-col-root',
        elements: {
            'two-col-root': { id: 'two-col-root', name: 'Two Column Grid', type: ElementType.Grid, props: { children: ['two-col-img', 'two-col-text'], spacing: 4, padding: 4, alignItems: 'center' } },
            'two-col-img': { id: 'two-col-img', name: 'Image Column', type: ElementType.Image, props: { src: 'https://picsum.photos/seed/g/600/400', xs: 12, md: 6, borderRadius: '16px' } },
            'two-col-text': { id: 'two-col-text', name: 'Text Column', type: ElementType.Container, props: { children: ['two-col-h', 'two-col-p', 'two-col-btn'], direction: 'col', gap: 2, xs: 12, md: 6 } },
            'two-col-h': { id: 'two-col-h', name: 'Headline', type: ElementType.Text, props: { content: 'A Powerful Feature', fontSize: 'h4', fontWeight: 'bold' } },
            'two-col-p': { id: 'two-col-p', name: 'Paragraph', type: ElementType.Text, props: { content: 'Explain your feature in detail here. Describe what makes it unique and how it can benefit the user. Use compelling language to draw the reader in.' } },
            'two-col-btn': { id: 'two-col-btn', name: 'Button', type: ElementType.Button, props: { text: 'Learn More', variant: 'outlined' } },
        }
    },
    // Template 13: Stats Section
    {
        name: 'Stats Section',
        icon: <QueryStats />,
        rootElementId: 'stats-root',
        elements: {
            'stats-root': { id: 'stats-root', name: 'Stats Grid', type: ElementType.Grid, props: { children: ['stat-1', 'stat-2', 'stat-3'], spacing: 4, padding: 6, backgroundColor: 'primary.light' } },
            'stat-1': { id: 'stat-1', name: 'Stat Item 1', type: ElementType.Container, props: { children: ['stat1-num', 'stat1-label'], direction: 'col', align: 'center', xs: 12, md: 4 } },
            'stat1-num': { id: 'stat1-num', name: 'Number', type: ElementType.Text, props: { content: '10,000+', fontSize: 'h3', fontWeight: 'bold' } },
            'stat1-label': { id: 'stat1-label', name: 'Label', type: ElementType.Text, props: { content: 'Happy Customers', color: 'text.secondary' } },
            'stat-2': { id: 'stat-2', name: 'Stat Item 2', type: ElementType.Container, props: { children: ['stat2-num', 'stat2-label'], direction: 'col', align: 'center', xs: 12, md: 4 } },
            'stat2-num': { id: 'stat2-num', name: 'Number', type: ElementType.Text, props: { content: '50+', fontSize: 'h3', fontWeight: 'bold' } },
            'stat2-label': { id: 'stat2-label', name: 'Label', type: ElementType.Text, props: { content: 'Awards Won', color: 'text.secondary' } },
            'stat-3': { id: 'stat-3', name: 'Stat Item 3', type: ElementType.Container, props: { children: ['stat3-num', 'stat3-label'], direction: 'col', align: 'center', xs: 12, md: 4 } },
            'stat3-num': { id: 'stat3-num', name: 'Number', type: ElementType.Text, props: { content: '24/7', fontSize: 'h3', fontWeight: 'bold' } },
            'stat3-label': { id: 'stat3-label', name: 'Label', type: ElementType.Text, props: { content: 'Support', color: 'text.secondary' } },
        }
    },
    // Template 14: Product Card
    {
        name: 'Product Card',
        icon: <ShoppingCart />,
        rootElementId: 'product-card-root',
        elements: {
            'product-card-root': { id: 'product-card-root', name: 'Product Card', type: ElementType.Card, props: { children: ['prod-img', 'prod-details'], padding: 0, shadow: 2, borderRadius: '16px' } },
            'prod-img': { id: 'prod-img', name: 'Product Image', type: ElementType.Image, props: { src: 'https://picsum.photos/seed/product/400/300', borderRadius: '0px' } },
            'prod-details': { id: 'prod-details', name: 'Product Details', type: ElementType.Container, props: { children: ['prod-title', 'prod-price', 'prod-button'], direction: 'col', gap: 1, padding: 2 } },
            'prod-title': { id: 'prod-title', name: 'Product Title', type: ElementType.Text, props: { content: 'Awesome Gadget', fontSize: 'h6' } },
            'prod-price': { id: 'prod-price', name: 'Product Price', type: ElementType.Text, props: { content: '$49.99', fontSize: 'body1', fontWeight: 'bold', color: 'primary.main' } },
            'prod-button': { id: 'prod-button', name: 'Add to Cart', type: ElementType.Button, props: { text: 'Add to Cart', variant: 'contained' } },
        }
    },
    // Template 15: Login Form
    {
        name: 'Login Form',
        icon: <Login />,
        rootElementId: 'login-root',
        elements: {
            'login-root': { id: 'login-root', name: 'Login Form Container', type: ElementType.Container, props: { children: ['login-title', 'login-email', 'login-password', 'login-button', 'login-forgot'], direction: 'col', gap: 2, padding: 4, backgroundColor: 'background.paper', borderRadius: '16px', shadow: 3 } },
            'login-title': { id: 'login-title', name: 'Title', type: ElementType.Text, props: { content: 'Member Login', fontSize: 'h4', fontWeight: 'bold' } },
            'login-email': { id: 'login-email', name: 'Email Input', type: ElementType.Input, props: { placeholder: 'Email Address', inputType: 'email' } },
            'login-password': { id: 'login-password', name: 'Password Input', type: ElementType.Input, props: { placeholder: 'Password', inputType: 'password' } },
            'login-button': { id: 'login-button', name: 'Login Button', type: ElementType.Button, props: { text: 'Login', variant: 'contained' } },
            'login-forgot': { id: 'login-forgot', name: 'Forgot Password Link', type: ElementType.Link, props: { text: 'Forgot Password?' } },
        }
    },
    // Template 16: 404 Page
    {
        name: '404 Not Found',
        icon: <ErrorOutline />,
        rootElementId: '404-root',
        elements: {
            '404-root': { id: '404-root', name: '404 Container', type: ElementType.Container, props: { children: ['404-code', '404-title', '404-subtitle', '404-button'], direction: 'col', align: 'center', justify: 'center', gap: 1, padding: 8 } },
            '404-code': { id: '404-code', name: '404 Code', type: ElementType.Text, props: { content: '404', fontSize: 'h1', fontWeight: 'bold', color: 'primary.main' } },
            '404-title': { id: '404-title', name: 'Title', type: ElementType.Text, props: { content: 'Page Not Found', fontSize: 'h3' } },
            '404-subtitle': { id: '404-subtitle', name: 'Subtitle', type: ElementType.Text, props: { content: 'Sorry, the page you are looking for does not exist.', color: 'text.secondary' } },
            '404-button': { id: '404-button', name: 'Home Button', type: ElementType.Button, props: { text: 'Go to Homepage', variant: 'contained' } },
        }
    },
    // Template 17: Newsletter Signup
    {
        name: 'Newsletter Signup',
        icon: <MarkEmailRead />,
        rootElementId: 'newsletter-root',
        elements: {
            'newsletter-root': { id: 'newsletter-root', name: 'Newsletter Container', type: ElementType.Container, props: { children: ['newsletter-title', 'newsletter-form'], direction: 'col', align: 'center', gap: 2, padding: 5, backgroundColor: 'grey.200', borderRadius: '16px' } },
            'newsletter-title': { id: 'newsletter-title', name: 'Title', type: ElementType.Text, props: { content: 'Subscribe to Our Newsletter', fontSize: 'h5' } },
            'newsletter-form': { id: 'newsletter-form', name: 'Form Container', type: ElementType.Container, props: { children: ['newsletter-input', 'newsletter-button'], direction: 'row', gap: 1 } },
            'newsletter-input': { id: 'newsletter-input', name: 'Email Input', type: ElementType.Input, props: { placeholder: 'Enter your email' } },
            'newsletter-button': { id: 'newsletter-button', name: 'Subscribe Button', type: ElementType.Button, props: { text: 'Subscribe', variant: 'contained' } },
        }
    },
    // Template 18: Services List
    {
        name: 'Services List',
        icon: <CheckCircleOutline />,
        rootElementId: 'services-root',
        elements: {
            'services-root': { id: 'services-root', name: 'Services Grid', type: ElementType.Grid, props: { children: ['service-1', 'service-2', 'service-3'], spacing: 4, padding: 4 } },
            'service-1': { id: 'service-1', name: 'Service Item 1', type: ElementType.Container, props: { children: ['s1-avatar', 's1-h6', 's1-p'], direction: 'col', align: 'center', justify: 'center', gap: 1.5, xs: 12, md: 4 } },
            's1-avatar': { id: 's1-avatar', name: 'Service Icon', type: ElementType.Avatar, props: { text: 'S1', backgroundColor: 'secondary.light' } },
            's1-h6': { id: 's1-h6', name: 'Service Title', type: ElementType.Text, props: { content: 'Web Development' } },
            's1-p': { id: 's1-p', name: 'Service Description', type: ElementType.Text, props: { content: 'Creating responsive and modern websites.', color: 'text.secondary' } },
            'service-2': { id: 'service-2', name: 'Service Item 2', type: ElementType.Container, props: { children: ['s2-avatar', 's2-h6', 's2-p'], direction: 'col', align: 'center', justify: 'center', gap: 1.5, xs: 12, md: 4 } },
            's2-avatar': { id: 's2-avatar', name: 'Service Icon', type: ElementType.Avatar, props: { text: 'S2', backgroundColor: 'secondary.light' } },
            's2-h6': { id: 's2-h6', name: 'Service Title', type: ElementType.Text, props: { content: 'Mobile Apps' } },
            's2-p': { id: 's2-p', name: 'Service Description', type: ElementType.Text, props: { content: 'Native apps for iOS and Android platforms.', color: 'text.secondary' } },
            'service-3': { id: 'service-3', name: 'Service Item 3', type: ElementType.Container, props: { children: ['s3-avatar', 's3-h6', 's3-p'], direction: 'col', align: 'center', justify: 'center', gap: 1.5, xs: 12, md: 4 } },
            's3-avatar': { id: 's3-avatar', name: 'Service Icon', type: ElementType.Avatar, props: { text: 'S3', backgroundColor: 'secondary.light' } },
            's3-h6': { id: 's3-h6', name: 'Service Title', type: ElementType.Text, props: { content: 'UI/UX Design' } },
            's3-p': { id: 's3-p', name: 'Service Description', type: ElementType.Text, props: { content: 'Intuitive and engaging user experiences.', color: 'text.secondary' } },
        }
    },
    // Template 19: Portfolio Showcase
    {
        name: 'Portfolio',
        icon: <Workspaces />,
        rootElementId: 'portfolio-root',
        elements: {
            'portfolio-root': { id: 'portfolio-root', name: 'Portfolio Grid', type: ElementType.Grid, props: { children: ['port-item1', 'port-item2', 'port-item3'], spacing: 3, padding: 4 } },
            'port-item1': { id: 'port-item1', name: 'Portfolio Item 1', type: ElementType.Card, props: { children: ['port1-img', 'port1-title'], padding: 0, xs: 12, md: 4 } },
            'port1-img': { id: 'port1-img', name: 'Project Image', type: ElementType.Image, props: { src: 'https://picsum.photos/seed/p1/400/300' } },
            'port1-title': { id: 'port1-title', name: 'Project Title', type: ElementType.Text, props: { content: 'Project Alpha', padding: 2, fontSize: 'h6' } },
            'port-item2': { id: 'port-item2', name: 'Portfolio Item 2', type: ElementType.Card, props: { children: ['port2-img', 'port2-title'], padding: 0, xs: 12, md: 4 } },
            'port2-img': { id: 'port2-img', name: 'Project Image', type: ElementType.Image, props: { src: 'https://picsum.photos/seed/p2/400/300' } },
            'port2-title': { id: 'port2-title', name: 'Project Title', type: ElementType.Text, props: { content: 'Project Beta', padding: 2, fontSize: 'h6' } },
            'port-item3': { id: 'port-item3', name: 'Portfolio Item 3', type: ElementType.Card, props: { children: ['port3-img', 'port3-title'], padding: 0, xs: 12, md: 4 } },
            'port3-img': { id: 'port3-img', name: 'Project Image', type: ElementType.Image, props: { src: 'https://picsum.photos/seed/p3/400/300' } },
            'port3-title': { id: 'port3-title', name: 'Project Title', type: ElementType.Text, props: { content: 'Project Gamma', padding: 2, fontSize: 'h6' } },
        }
    },
    // Template 20: About Us
    {
        name: 'About Us',
        icon: <Business />,
        rootElementId: 'about-root',
        elements: {
            'about-root': { id: 'about-root', name: 'About Section', type: ElementType.Grid, props: { children: ['about-text-col', 'about-img-col'], spacing: 5, padding: 5, alignItems: 'center' } },
            'about-text-col': { id: 'about-text-col', name: 'Text Column', type: ElementType.Container, props: { children: ['about-h', 'about-p1', 'about-p2'], direction: 'col', gap: 2, xs: 12, md: 7 } },
            'about-h': { id: 'about-h', name: 'Headline', type: ElementType.Text, props: { content: 'About Our Company', fontSize: 'h3', fontWeight: 'bold' } },
            'about-p1': { id: 'about-p1', name: 'Paragraph 1', type: ElementType.Text, props: { content: 'We are a team of passionate designers and developers dedicated to creating high-quality, user-centric digital experiences. Our mission is to empower businesses by providing them with the tools they need to succeed online.' } },
            'about-p2': { id: 'about-p2', name: 'Paragraph 2', type: ElementType.Text, props: { content: 'Founded in 2020, we have since grown into a thriving agency that has helped countless clients achieve their goals.', color: 'text.secondary' } },
            'about-img-col': { id: 'about-img-col', name: 'Image Column', type: ElementType.Image, props: { src: 'https://picsum.photos/seed/team/600/500', xs: 12, md: 5, borderRadius: '16px' } },
        }
    },
    // Template 21: Process Steps
    {
        name: 'Process Steps',
        icon: <Stairs />,
        rootElementId: 'process-root',
        elements: {
            'process-root': { id: 'process-root', name: 'Process Grid', type: ElementType.Grid, props: { children: ['proc-step1', 'proc-step2', 'proc-step3', 'proc-step4'], spacing: 3, padding: 4 } },
            'proc-step1': { id: 'proc-step1', name: 'Step 1', type: ElementType.Container, props: { children: ['ps1-avatar', 'ps1-title', 'ps1-desc'], direction: 'col', align: 'center', gap: 1, xs: 12, md: 3 } },
            'ps1-avatar': { id: 'ps1-avatar', name: 'Step Number', type: ElementType.Avatar, props: { text: '1', backgroundColor: 'grey.300' } },
            'ps1-title': { id: 'ps1-title', name: 'Step Title', type: ElementType.Text, props: { content: 'Discovery', fontSize: 'h6' } },
            'ps1-desc': { id: 'ps1-desc', name: 'Step Description', type: ElementType.Text, props: { content: 'We listen to your needs.', color: 'text.secondary' } },
            'proc-step2': { id: 'proc-step2', name: 'Step 2', type: ElementType.Container, props: { children: ['ps2-avatar', 'ps2-title', 'ps2-desc'], direction: 'col', align: 'center', gap: 1, xs: 12, md: 3 } },
            'ps2-avatar': { id: 'ps2-avatar', name: 'Step Number', type: ElementType.Avatar, props: { text: '2', backgroundColor: 'grey.300' } },
            'ps2-title': { id: 'ps2-title', name: 'Step Title', type: ElementType.Text, props: { content: 'Design', fontSize: 'h6' } },
            'ps2-desc': { id: 'ps2-desc', name: 'Step Description', type: ElementType.Text, props: { content: 'We create a prototype.', color: 'text.secondary' } },
            'proc-step3': { id: 'proc-step3', name: 'Step 3', type: ElementType.Container, props: { children: ['ps3-avatar', 'ps3-title', 'ps3-desc'], direction: 'col', align: 'center', gap: 1, xs: 12, md: 3 } },
            'ps3-avatar': { id: 'ps3-avatar', name: 'Step Number', type: ElementType.Avatar, props: { text: '3', backgroundColor: 'grey.300' } },
            'ps3-title': { id: 'ps3-title', name: 'Step Title', type: ElementType.Text, props: { content: 'Development', fontSize: 'h6' } },
            'ps3-desc': { id: 'ps3-desc', name: 'Step Description', type: ElementType.Text, props: { content: 'We build the product.', color: 'text.secondary' } },
            'proc-step4': { id: 'proc-step4', name: 'Step 4', type: ElementType.Container, props: { children: ['ps4-avatar', 'ps4-title', 'ps4-desc'], direction: 'col', align: 'center', gap: 1, xs: 12, md: 3 } },
            'ps4-avatar': { id: 'ps4-avatar', name: 'Step Number', type: ElementType.Avatar, props: { text: '4', backgroundColor: 'grey.300' } },
            'ps4-title': { id: 'ps4-title', name: 'Step Title', type: ElementType.Text, props: { content: 'Launch', fontSize: 'h6' } },
            'ps4-desc': { id: 'ps4-desc', name: 'Step Description', type: ElementType.Text, props: { content: 'We deploy and support.', color: 'text.secondary' } },
        }
    },
    // Template 22: Blog Post Intro
    {
        name: 'Blog Post Intro',
        icon: <Article />,
        rootElementId: 'blog-intro-root',
        elements: {
            'blog-intro-root': { id: 'blog-intro-root', name: 'Blog Intro Container', type: ElementType.Container, props: { children: ['blog-title', 'blog-meta', 'blog-image', 'blog-intro-p'], direction: 'col', gap: 2, padding: 4 } },
            'blog-title': { id: 'blog-title', name: 'Post Title', type: ElementType.Text, props: { content: 'The Ultimate Guide to No-Code Development', fontSize: 'h3', fontWeight: 'bold' } },
            'blog-meta': { id: 'blog-meta', name: 'Meta Info', type: ElementType.Text, props: { content: 'By John Appleseed | Published on August 5, 2024', color: 'text.secondary' } },
            'blog-image': { id: 'blog-image', name: 'Featured Image', type: ElementType.Image, props: { src: 'https://picsum.photos/seed/blog/800/400', borderRadius: '16px' } },
            'blog-intro-p': { id: 'blog-intro-p', name: 'Intro Paragraph', type: ElementType.Text, props: { content: 'Welcome to our deep dive into the world of no-code. In this article, we will explore the benefits, the tools, and the future of building applications without writing a single line of code. Whether you are a seasoned developer or a complete beginner, there is something here for you.' } },
        }
    },

    // APP-FOCUSED TEMPLATES
    // Template: Mobile App Screen
    {
        name: 'Mobile App Screen',
        icon: <PhoneIphone />,
        rootElementId: 'mobile-screen-root',
        elements: {
            'mobile-screen-root': { id: 'mobile-screen-root', name: 'Screen Container', type: ElementType.Container, props: { children: ['app-bar', 'content-area', 'nav-bar'], direction: 'col', width: '100%', height: '100vh', gap: 0 } },
            'app-bar': { id: 'app-bar', name: 'App Bar', type: ElementType.AppBar, props: { title: 'My App', showBackButton: false, actions: ['menu'] } },
            'content-area': { id: 'content-area', name: 'Content Area', type: ElementType.Container, props: { children: ['welcome-card'], direction: 'col', gap: 2, padding: 4, flex: 1 } },
            'welcome-card': { id: 'welcome-card', name: 'Welcome Card', type: ElementType.StatusCard, props: { title: 'Welcome', value: 'Get Started', trend: 'up', icon: 'waving_hand', color: 'primary' } },
            'nav-bar': { id: 'nav-bar', name: 'Navigation Bar', type: ElementType.NavigationBar, props: { items: [{ label: 'Home', icon: 'home' }, { label: 'Search', icon: 'search' }, { label: 'Profile', icon: 'person' }], variant: 'bottom', showLabels: true } },
        }
    },

    // Template: Dashboard Module
    {
        name: 'Analytics Dashboard',
        icon: <Assessment />,
        rootElementId: 'dashboard-root',
        elements: {
            'dashboard-root': { id: 'dashboard-root', name: 'Dashboard Container', type: ElementType.Container, props: { children: ['dashboard-header', 'stats-grid', 'charts-section'], direction: 'col', gap: 3, padding: 4 } },
            'dashboard-header': { id: 'dashboard-header', name: 'Dashboard Header', type: ElementType.Text, props: { content: 'Analytics Dashboard', fontSize: 'h4', fontWeight: 'bold' } },
            'stats-grid': { id: 'stats-grid', name: 'Stats Grid', type: ElementType.Grid, props: { children: ['stat-users', 'stat-revenue', 'stat-growth'], spacing: 3 } },
            'stat-users': { id: 'stat-users', name: 'Users Card', type: ElementType.StatusCard, props: { title: 'Total Users', value: '12,345', trend: 'up', icon: 'people', color: 'primary', xs: 12, md: 4 } },
            'stat-revenue': { id: 'stat-revenue', name: 'Revenue Card', type: ElementType.StatusCard, props: { title: 'Revenue', value: '$45,678', trend: 'up', icon: 'attach_money', color: 'success', xs: 12, md: 4 } },
            'stat-growth': { id: 'stat-growth', name: 'Growth Card', type: ElementType.StatusCard, props: { title: 'Growth', value: '+23%', trend: 'up', icon: 'trending_up', color: 'warning', xs: 12, md: 4 } },
            'charts-section': { id: 'charts-section', name: 'Charts Section', type: ElementType.Chart, props: { type: 'line', title: 'Monthly Revenue', legend: true, height: '400px' } },
        }
    },

    // Template: User Profile Module
    {
        name: 'User Profile',
        icon: <Person />,
        rootElementId: 'profile-root',
        elements: {
            'profile-root': { id: 'profile-root', name: 'Profile Container', type: ElementType.Container, props: { children: ['profile-header', 'profile-tabs'], direction: 'col', gap: 3, padding: 4 } },
            'profile-header': { id: 'profile-header', name: 'Profile Header', type: ElementType.Container, props: { children: ['profile-avatar', 'profile-info'], direction: 'row', align: 'center', gap: 3, padding: 4, backgroundColor: 'grey.100', borderRadius: '12px' } },
            'profile-avatar': { id: 'profile-avatar', name: 'Profile Avatar', type: ElementType.Avatar, props: { src: 'https://i.pravatar.cc/150?u=user', width: '80px', height: '80px' } },
            'profile-info': { id: 'profile-info', name: 'Profile Info', type: ElementType.Container, props: { children: ['profile-name', 'profile-email', 'profile-badge'], direction: 'col', gap: 1 } },
            'profile-name': { id: 'profile-name', name: 'Profile Name', type: ElementType.Text, props: { content: 'John Doe', fontSize: 'h5', fontWeight: 'bold' } },
            'profile-email': { id: 'profile-email', name: 'Profile Email', type: ElementType.Text, props: { content: 'john.doe@example.com', color: 'text.secondary' } },
            'profile-badge': { id: 'profile-badge', name: 'Status Badge', type: ElementType.Chip, props: { label: 'Premium User', color: 'primary', variant: 'filled' } },
            'profile-tabs': { id: 'profile-tabs', name: 'Profile Tabs', type: ElementType.Tabs, props: { children: ['tab-settings', 'tab-activity'], variant: 'fullWidth' } },
            'tab-settings': { id: 'tab-settings', name: 'Settings Tab', type: ElementType.Text, props: { content: 'Settings content goes here...' } },
            'tab-activity': { id: 'tab-activity', name: 'Activity Tab', type: ElementType.Text, props: { content: 'Activity timeline goes here...' } },
        }
    },

    // Template: E-commerce Product List
    {
        name: 'Product Catalog',
        icon: <ShoppingCart />,
        rootElementId: 'catalog-root',
        elements: {
            'catalog-root': { id: 'catalog-root', name: 'Catalog Container', type: ElementType.Container, props: { children: ['catalog-header', 'catalog-filters', 'product-grid'], direction: 'col', gap: 3, padding: 4 } },
            'catalog-header': { id: 'catalog-header', name: 'Catalog Header', type: ElementType.Container, props: { children: ['catalog-title', 'catalog-search'], direction: 'row', justify: 'space-between', align: 'center' } },
            'catalog-title': { id: 'catalog-title', name: 'Catalog Title', type: ElementType.Text, props: { content: 'Products', fontSize: 'h4', fontWeight: 'bold' } },
            'catalog-search': { id: 'catalog-search', name: 'Search Bar', type: ElementType.SearchBar, props: { placeholder: 'Search products...', showFilter: true, width: '300px' } },
            'catalog-filters': { id: 'catalog-filters', name: 'Filter Chips', type: ElementType.Container, props: { children: ['filter-all', 'filter-electronics', 'filter-clothing'], direction: 'row', gap: 1 } },
            'filter-all': { id: 'filter-all', name: 'All Filter', type: ElementType.Chip, props: { label: 'All', variant: 'filled', color: 'primary' } },
            'filter-electronics': { id: 'filter-electronics', name: 'Electronics Filter', type: ElementType.Chip, props: { label: 'Electronics', variant: 'outlined' } },
            'filter-clothing': { id: 'filter-clothing', name: 'Clothing Filter', type: ElementType.Chip, props: { label: 'Clothing', variant: 'outlined' } },
            'product-grid': { id: 'product-grid', name: 'Product Grid', type: ElementType.DataGrid, props: { columns: [{ field: 'name', headerName: 'Product' }, { field: 'price', headerName: 'Price' }, { field: 'category', headerName: 'Category' }], rows: [{ id: 1, name: 'Smartphone', price: '$599', category: 'Electronics' }, { id: 2, name: 'T-Shirt', price: '$29', category: 'Clothing' }], striped: true } },
        }
    },

    // Template: Onboarding Flow
    {
        name: 'App Onboarding',
        icon: <Stairs />,
        rootElementId: 'onboarding-root',
        elements: {
            'onboarding-root': { id: 'onboarding-root', name: 'Onboarding Container', type: ElementType.Container, props: { children: ['onboarding-stepper', 'onboarding-content', 'onboarding-actions'], direction: 'col', gap: 4, padding: 4, height: '100vh', justify: 'center' } },
            'onboarding-stepper': { id: 'onboarding-stepper', name: 'Progress Stepper', type: ElementType.Stepper, props: { steps: ['Welcome', 'Setup', 'Complete'], activeStep: 0, orientation: 'horizontal' } },
            'onboarding-content': { id: 'onboarding-content', name: 'Content Area', type: ElementType.Container, props: { children: ['onb-image', 'onb-title', 'onb-description'], direction: 'col', align: 'center', gap: 3, padding: 4 } },
            'onb-image': { id: 'onb-image', name: 'Onboarding Image', type: ElementType.Image, props: { src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop', width: '300px', height: '200px', borderRadius: '16px' } },
            'onb-title': { id: 'onb-title', name: 'Welcome Title', type: ElementType.Text, props: { content: 'Welcome to Our App', fontSize: 'h3', fontWeight: 'bold', textAlign: 'center' } },
            'onb-description': { id: 'onb-description', name: 'Description', type: ElementType.Text, props: { content: 'Discover amazing features that will transform your workflow and boost your productivity.', textAlign: 'center', color: 'text.secondary' } },
            'onboarding-actions': { id: 'onboarding-actions', name: 'Action Buttons', type: ElementType.Container, props: { children: ['onb-skip', 'onb-next'], direction: 'row', justify: 'space-between' } },
            'onb-skip': { id: 'onb-skip', name: 'Skip Button', type: ElementType.Button, props: { text: 'Skip', variant: 'text' } },
            'onb-next': { id: 'onb-next', name: 'Next Button', type: ElementType.Button, props: { text: 'Next', variant: 'contained' } },
        }
    },

    // Template: Settings Module
    {
        name: 'App Settings',
        icon: <Tune />,
        rootElementId: 'settings-root',
        elements: {
            'settings-root': { id: 'settings-root', name: 'Settings Container', type: ElementType.Container, props: { children: ['settings-header', 'settings-sections'], direction: 'col', gap: 3, padding: 4 } },
            'settings-header': { id: 'settings-header', name: 'Settings Header', type: ElementType.Text, props: { content: 'Settings', fontSize: 'h4', fontWeight: 'bold' } },
            'settings-sections': { id: 'settings-sections', name: 'Settings Sections', type: ElementType.Container, props: { children: ['notif-section', 'privacy-section', 'appearance-section'], direction: 'col', gap: 2 } },
            'notif-section': { id: 'notif-section', name: 'Notifications Section', type: ElementType.Card, props: { children: ['notif-title', 'notif-toggle'], padding: 3 } },
            'notif-title': { id: 'notif-title', name: 'Notifications Title', type: ElementType.Text, props: { content: 'Notifications', fontSize: 'h6', fontWeight: 'medium' } },
            'notif-toggle': { id: 'notif-toggle', name: 'Notification Toggle', type: ElementType.Switch, props: { checked: true } },
            'privacy-section': { id: 'privacy-section', name: 'Privacy Section', type: ElementType.Card, props: { children: ['privacy-title', 'privacy-rating'], padding: 3 } },
            'privacy-title': { id: 'privacy-title', name: 'Privacy Title', type: ElementType.Text, props: { content: 'Privacy Level', fontSize: 'h6', fontWeight: 'medium' } },
            'privacy-rating': { id: 'privacy-rating', name: 'Privacy Rating', type: ElementType.Rating, props: { value: 4, max: 5, readOnly: false } },
            'appearance-section': { id: 'appearance-section', name: 'Appearance Section', type: ElementType.Card, props: { children: ['appearance-title', 'theme-slider'], padding: 3 } },
            'appearance-title': { id: 'appearance-title', name: 'Appearance Title', type: ElementType.Text, props: { content: 'Theme Brightness', fontSize: 'h6', fontWeight: 'medium' } },
            'theme-slider': { id: 'theme-slider', name: 'Theme Slider', type: ElementType.Slider, props: { value: 70, min: 0, max: 100, marks: true } },
        }
    }
];
