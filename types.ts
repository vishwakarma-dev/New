export enum ElementType {
    Container = 'Container',
    Text = 'Text',
    Button = 'Button',
    Image = 'Image',
    Spacer = 'Spacer',
    Input = 'Input',
    Divider = 'Divider',
    Stack = 'Stack',
    Card = 'Card',
    Accordion = 'Accordion',
    Alert = 'Alert',
    Grid = 'Grid',
    Link = 'Link',
    Avatar = 'Avatar',
    List = 'List',
    LinearProgress = 'LinearProgress',
    Switch = 'Switch',
    Carousel = 'Carousel',
    Slide = 'Slide',
    Header = 'Header',
    DataGrid = 'DataGrid',
    // Advanced App Components
    Chart = 'Chart',
    Form = 'Form',
    Tabs = 'Tabs',
    Modal = 'Modal',
    Drawer = 'Drawer',
    BottomSheet = 'BottomSheet',
    FloatingActionButton = 'FloatingActionButton',
    SegmentedControl = 'SegmentedControl',
    SearchBar = 'SearchBar',
    AppBar = 'AppBar',
    NavigationBar = 'NavigationBar',
    StatusCard = 'StatusCard',
    Timeline = 'Timeline',
    Stepper = 'Stepper',
    Rating = 'Rating',
    Chip = 'Chip',
    Badge = 'Badge',
    Toggle = 'Toggle',
    Slider = 'Slider',
    DatePicker = 'DatePicker',
    TimePicker = 'TimePicker',
    FileUpload = 'FileUpload',
    MapView = 'MapView',
    VideoPlayer = 'VideoPlayer',
    QRCode = 'QRCode',
    LoadingSpinner = 'LoadingSpinner',
}

export type ViewMode = 'desktop' | 'tablet' | 'mobile';

export interface ThemeSettings {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    borderRadius?: number;
    spacingUnit?: number;
    fontFamily?: string;
}

export type ElementEvent = 'onClick' | 'onLoad';
export type ActionType = 'openUrl' | 'scrollTo';
export interface ElementAction {
    id: string;
    event: ElementEvent;
    type: ActionType;
    params: { [key: string]: any };
}

export interface BaseProps {
    // Layout
    display?: 'flex' | 'block' | 'inline-block' | 'grid' | 'none' | 'inline-flex';

    // Sizing
    width?: string | number;
    height?: string | number;
    maxWidth?: string;
    minHeight?: string;

    // Spacing
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;

    // Style
    backgroundColor?: string;
    backgroundImage?: string;
    borderRadius?: string;
    border?: string;
    boxShadow?: string;
    opacity?: number;

    // Grid item props (from MUI Grid)
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;

    // Misc
    customClass?: string;
    customCss?: { [key: string]: string };
    sx?: any;
    actions?: ElementAction[];

    // LEGACY props for backwards compatibility.
    padding?: number;
    shadow?: number;
}

export interface ContainerProps extends BaseProps {
    children?: string[];
    direction?: 'row' | 'col';
    justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
    align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    gap?: number;
}

export interface StackProps extends BaseProps {
    children?: string[];
    direction?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    spacing?: number;
}

export interface CardProps extends BaseProps {
    children?: string[];
}

export interface AccordionProps extends BaseProps {
    children?: string[];
    summaryText?: string;
}

export interface AlertProps extends BaseProps {
    message?: string;
    severity?: 'success' | 'info' | 'warning' | 'error';
}

export interface TextProps extends BaseProps {
    content?: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: string;
    letterSpacing?: string;
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline' | 'line-through';
}

export interface ButtonProps extends BaseProps {
    text?: string;
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

export interface ImageProps extends BaseProps {
    src?: string;
    alt?: string;
}

export interface SpacerProps extends BaseProps {
    height?: number;
}

export interface InputProps extends BaseProps {
    placeholder?: string;
    inputType?: 'text' | 'email' | 'password';
    variant?: 'outlined' | 'filled' | 'standard';
    multiline?: boolean;
    rows?: number;
}

export interface DividerProps extends BaseProps {}

export interface GridProps extends BaseProps {
    children?: string[];
    spacing?: number;
    columns?: number;
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
}

export interface LinkProps extends BaseProps {
    text?: string;
    href?: string;
    color?: string;
}

export interface AvatarProps extends BaseProps {
    src?: string;
    alt?: string;
    text?: string;
}

export interface ListProps extends BaseProps {
    children?: string[];
    dense?: boolean;
}

export interface LinearProgressProps extends BaseProps {
    value?: number;
    variant?: 'determinate' | 'indeterminate';
}

export interface SwitchProps extends BaseProps {
    checked?: boolean;
}

export interface CarouselProps extends BaseProps {
    children?: string[];
    showArrows?: boolean;
    showDots?: boolean;
    autoPlay?: boolean;
    interval?: number;
}

export interface SlideProps extends ContainerProps {
    // A slide is essentially a container
}

export interface HeaderProps extends ContainerProps {
    position?: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';
    color?: 'inherit' | 'primary' | 'secondary' | 'default' | 'transparent';
}

export interface DataGridColumn {
    field: string;
    headerName: string;
}

export interface DataGridProps extends BaseProps {
    columns?: DataGridColumn[];
    rows?: { [key: string]: any }[];
    dataSourceId?: string;
    striped?: boolean;
}

// Advanced App Component Interfaces
export interface ChartProps extends BaseProps {
    type?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
    data?: any;
    dataSourceId?: string;
    title?: string;
    legend?: boolean;
}

export interface FormProps extends BaseProps {
    children?: string[];
    method?: 'GET' | 'POST';
    action?: string;
    validation?: boolean;
}

export interface TabsProps extends BaseProps {
    children?: string[];
    variant?: 'standard' | 'scrollable' | 'fullWidth';
    orientation?: 'horizontal' | 'vertical';
}

export interface ModalProps extends BaseProps {
    children?: string[];
    title?: string;
    trigger?: string;
    size?: 'small' | 'medium' | 'large' | 'fullscreen';
}

export interface DrawerProps extends BaseProps {
    children?: string[];
    anchor?: 'left' | 'right' | 'top' | 'bottom';
    variant?: 'temporary' | 'persistent' | 'permanent';
}

export interface BottomSheetProps extends BaseProps {
    children?: string[];
    title?: string;
    expandable?: boolean;
}

export interface FloatingActionButtonProps extends BaseProps {
    icon?: string;
    color?: 'primary' | 'secondary' | 'inherit';
    size?: 'small' | 'medium' | 'large';
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export interface SegmentedControlProps extends BaseProps {
    options?: string[];
    selected?: number;
    color?: 'primary' | 'secondary';
}

export interface SearchBarProps extends BaseProps {
    placeholder?: string;
    showFilter?: boolean;
    suggestions?: string[];
}

export interface AppBarProps extends BaseProps {
    children?: string[];
    title?: string;
    showBackButton?: boolean;
    actions?: string[];
}

export interface NavigationBarProps extends BaseProps {
    items?: { label: string; icon: string; badge?: number }[];
    variant?: 'bottom' | 'side';
    showLabels?: boolean;
}

export interface StatusCardProps extends BaseProps {
    title?: string;
    value?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon?: string;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export interface TimelineProps extends BaseProps {
    items?: { title: string; description: string; date: string; status?: 'completed' | 'active' | 'pending' }[];
    orientation?: 'vertical' | 'horizontal';
}

export interface StepperProps extends BaseProps {
    steps?: string[];
    activeStep?: number;
    orientation?: 'horizontal' | 'vertical';
}

export interface RatingProps extends BaseProps {
    value?: number;
    max?: number;
    readOnly?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export interface ChipProps extends BaseProps {
    label?: string;
    variant?: 'filled' | 'outlined';
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    deletable?: boolean;
}

export interface BadgeProps extends BaseProps {
    children?: string[];
    content?: string | number;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success';
    variant?: 'standard' | 'dot';
}

export interface ToggleProps extends BaseProps {
    options?: string[];
    selected?: string;
    exclusive?: boolean;
}

export interface SliderProps extends BaseProps {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    marks?: boolean;
    orientation?: 'horizontal' | 'vertical';
}

export interface DatePickerProps extends BaseProps {
    value?: string;
    format?: string;
    disablePast?: boolean;
    disableFuture?: boolean;
}

export interface TimePickerProps extends BaseProps {
    value?: string;
    format?: '12h' | '24h';
}

export interface FileUploadProps extends BaseProps {
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    dragDrop?: boolean;
}

export interface MapViewProps extends BaseProps {
    center?: { lat: number; lng: number };
    zoom?: number;
    markers?: { lat: number; lng: number; title?: string }[];
}

export interface VideoPlayerProps extends BaseProps {
    src?: string;
    controls?: boolean;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
}

export interface QRCodeProps extends BaseProps {
    value?: string;
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
}

export interface LoadingSpinnerProps extends BaseProps {
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary' | 'inherit';
    variant?: 'circular' | 'linear';
}

export interface Layout {
    name: string;
    rows: number;
    cols: number;
}

// App Module System
export interface AppModule {
    id: string;
    name: string;
    description: string;
    type: 'feature' | 'service' | 'ui' | 'data';
    pages: string[]; // Page IDs that belong to this module
    dependencies?: string[]; // Other module IDs this module depends on
    config?: { [key: string]: any };
    icon?: string;
    color?: string;
}

export type ElementProps = ContainerProps | TextProps | ButtonProps | ImageProps | SpacerProps | InputProps | DividerProps | StackProps | CardProps | AccordionProps | AlertProps | GridProps | LinkProps | AvatarProps | ListProps | LinearProgressProps | SwitchProps | CarouselProps | SlideProps | HeaderProps | DataGridProps | ChartProps | FormProps | TabsProps | ModalProps | DrawerProps | BottomSheetProps | FloatingActionButtonProps | SegmentedControlProps | SearchBarProps | AppBarProps | NavigationBarProps | StatusCardProps | TimelineProps | StepperProps | RatingProps | ChipProps | BadgeProps | ToggleProps | SliderProps | DatePickerProps | TimePickerProps | FileUploadProps | MapViewProps | VideoPlayerProps | QRCodeProps | LoadingSpinnerProps;

// A type that combines all possible props by intersecting them.
// The `keyof` this intersection will be a union of all possible prop keys from each interface.
// This is used to allow the property editor to update any valid prop for any element type.
type AllPropsCombined = ContainerProps & TextProps & ButtonProps & ImageProps & SpacerProps & InputProps & DividerProps & StackProps & CardProps & AccordionProps & AlertProps & GridProps & LinkProps & AvatarProps & ListProps & LinearProgressProps & SwitchProps & CarouselProps & SlideProps & HeaderProps & DataGridProps & ChartProps & FormProps & TabsProps & ModalProps & DrawerProps & BottomSheetProps & FloatingActionButtonProps & SegmentedControlProps & SearchBarProps & AppBarProps & NavigationBarProps & StatusCardProps & TimelineProps & StepperProps & RatingProps & ChipProps & BadgeProps & ToggleProps & SliderProps & DatePickerProps & TimePickerProps & FileUploadProps & MapViewProps & VideoPlayerProps & QRCodeProps & LoadingSpinnerProps;
export type AnyElementPropKey = keyof AllPropsCombined;

export interface EditorElement {
    id: string;
    type: ElementType;
    name: string;
    props: ElementProps;
}

export interface DataSource {
    id: string;
    name: string;
    url: string;
    data: any | null;
    status: 'loading' | 'success' | 'error';
    error: string | null;
}

export interface Comment {
    id: string;
    elementId: string | null;
    author: string;
    text: string;
    timestamp: number;
    resolved: boolean;
}

export interface PageVersion {
    id: string;
    name: string;
    timestamp: number;
    snapshot: Page;
}

export interface Page {
    id: string;
    name: string;
    elements: { [key: string]: EditorElement };
    rootElementId: string;
    theme?: ThemeSettings;
    dataSources: DataSource[];
    comments?: Comment[];
    versions?: PageVersion[];
    moduleId?: string; // Which module this page belongs to
    pageType?: 'screen' | 'modal' | 'dialog' | 'component'; // Type of page for apps
}

export interface Project {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    imageUrl: string;
    status: 'Active' | 'Inactive' | 'New';
    pages: Page[];
    modules?: AppModule[]; // App modules
    projectType?: 'web' | 'mobile' | 'desktop' | 'hybrid'; // Type of application
    platform?: 'react' | 'react-native' | 'flutter' | 'pwa'; // Target platform
    reusableComponents?: Template[];
    isPublic?: boolean;
    shareId?: string;
}

export interface Template {
    name: string;
    icon: React.ReactNode;
    rootElementId: string;
    elements: { [key: string]: EditorElement };
}
