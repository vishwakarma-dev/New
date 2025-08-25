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

export interface Layout {
    name: string;
    rows: number;
    cols: number;
}


export type ElementProps = ContainerProps | TextProps | ButtonProps | ImageProps | SpacerProps | InputProps | DividerProps | StackProps | CardProps | AccordionProps | AlertProps | GridProps | LinkProps | AvatarProps | ListProps | LinearProgressProps | SwitchProps | CarouselProps | SlideProps | HeaderProps | DataGridProps;

// A type that combines all possible props by intersecting them.
// The `keyof` this intersection will be a union of all possible prop keys from each interface.
// This is used to allow the property editor to update any valid prop for any element type.
type AllPropsCombined = ContainerProps & TextProps & ButtonProps & ImageProps & SpacerProps & InputProps & DividerProps & StackProps & CardProps & AccordionProps & AlertProps & GridProps & LinkProps & AvatarProps & ListProps & LinearProgressProps & SwitchProps & CarouselProps & SlideProps & HeaderProps & DataGridProps;
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

export interface Page {
    id: string;
    name: string;
    elements: { [key: string]: EditorElement };
    rootElementId: string;
    theme?: ThemeSettings;
    dataSources: DataSource[];
}

export interface Project {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    imageUrl: string;
    status: 'Active' | 'Inactive' | 'New';
    pages: Page[];
}

export interface Template {
    name: string;
    icon: React.ReactNode;
    rootElementId: string;
    elements: { [key: string]: EditorElement };
}
