import { Project, Page, EditorElement, ElementType } from '../types';

// Utility to convert element props to React props string
const propsToString = (props: any): string => {
  const propStrings: string[] = [];
  
  Object.entries(props).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (typeof value === 'string') {
      propStrings.push(`${key}="${value}"`);
    } else if (typeof value === 'number') {
      propStrings.push(`${key}={${value}}`);
    } else if (typeof value === 'boolean') {
      if (value) propStrings.push(key);
    } else if (typeof value === 'object') {
      propStrings.push(`${key}={${JSON.stringify(value)}}`);
    }
  });
  
  return propStrings.join(' ');
};

// Map element types to MUI component names
const getComponentName = (type: ElementType): string => {
  const componentMap: { [key in ElementType]: string } = {
    [ElementType.Container]: 'Box',
    [ElementType.Text]: 'Typography',
    [ElementType.Button]: 'Button',
    [ElementType.Image]: 'img',
    [ElementType.Spacer]: 'Box',
    [ElementType.Input]: 'TextField',
    [ElementType.Divider]: 'Divider',
    [ElementType.Stack]: 'Stack',
    [ElementType.Card]: 'Card',
    [ElementType.Accordion]: 'Accordion',
    [ElementType.Alert]: 'Alert',
    [ElementType.Grid]: 'Grid',
    [ElementType.Link]: 'Link',
    [ElementType.Avatar]: 'Avatar',
    [ElementType.List]: 'List',
    [ElementType.LinearProgress]: 'LinearProgress',
    [ElementType.Switch]: 'Switch',
    [ElementType.Carousel]: 'Box',
    [ElementType.Slide]: 'Box',
    [ElementType.Header]: 'AppBar',
    [ElementType.DataGrid]: 'DataGrid',
    [ElementType.Chart]: 'Box',
    [ElementType.Form]: 'Box',
    [ElementType.Tabs]: 'Tabs',
    [ElementType.Modal]: 'Modal',
    [ElementType.Drawer]: 'Drawer',
    [ElementType.BottomSheet]: 'Box',
    [ElementType.FloatingActionButton]: 'Fab',
    [ElementType.SegmentedControl]: 'ToggleButtonGroup',
    [ElementType.SearchBar]: 'TextField',
    [ElementType.AppBar]: 'AppBar',
    [ElementType.NavigationBar]: 'BottomNavigation',
    [ElementType.StatusCard]: 'Card',
    [ElementType.Timeline]: 'Timeline',
    [ElementType.Stepper]: 'Stepper',
    [ElementType.Rating]: 'Rating',
    [ElementType.Chip]: 'Chip',
    [ElementType.Badge]: 'Badge',
    [ElementType.Toggle]: 'ToggleButton',
    [ElementType.Slider]: 'Slider',
    [ElementType.DatePicker]: 'DatePicker',
    [ElementType.TimePicker]: 'TimePicker',
    [ElementType.FileUpload]: 'Button',
    [ElementType.MapView]: 'Box',
    [ElementType.VideoPlayer]: 'video',
    [ElementType.QRCode]: 'Box',
    [ElementType.LoadingSpinner]: 'CircularProgress',
  };
  
  return componentMap[type] || 'Box';
};

// Get required imports for a component
const getRequiredImports = (type: ElementType): string[] => {
  const importMap: { [key in ElementType]: string[] } = {
    [ElementType.Container]: ['Box'],
    [ElementType.Text]: ['Typography'],
    [ElementType.Button]: ['Button'],
    [ElementType.Image]: [],
    [ElementType.Spacer]: ['Box'],
    [ElementType.Input]: ['TextField'],
    [ElementType.Divider]: ['Divider'],
    [ElementType.Stack]: ['Stack'],
    [ElementType.Card]: ['Card'],
    [ElementType.Accordion]: ['Accordion'],
    [ElementType.Alert]: ['Alert'],
    [ElementType.Grid]: ['Grid'],
    [ElementType.Link]: ['Link'],
    [ElementType.Avatar]: ['Avatar'],
    [ElementType.List]: ['List'],
    [ElementType.LinearProgress]: ['LinearProgress'],
    [ElementType.Switch]: ['Switch'],
    [ElementType.Carousel]: ['Box'],
    [ElementType.Slide]: ['Box'],
    [ElementType.Header]: ['AppBar'],
    [ElementType.DataGrid]: ['DataGrid'],
    [ElementType.Chart]: ['Box'],
    [ElementType.Form]: ['Box'],
    [ElementType.Tabs]: ['Tabs'],
    [ElementType.Modal]: ['Modal'],
    [ElementType.Drawer]: ['Drawer'],
    [ElementType.BottomSheet]: ['Box'],
    [ElementType.FloatingActionButton]: ['Fab'],
    [ElementType.SegmentedControl]: ['ToggleButtonGroup'],
    [ElementType.SearchBar]: ['TextField'],
    [ElementType.AppBar]: ['AppBar'],
    [ElementType.NavigationBar]: ['BottomNavigation'],
    [ElementType.StatusCard]: ['Card'],
    [ElementType.Timeline]: ['Timeline'],
    [ElementType.Stepper]: ['Stepper'],
    [ElementType.Rating]: ['Rating'],
    [ElementType.Chip]: ['Chip'],
    [ElementType.Badge]: ['Badge'],
    [ElementType.Toggle]: ['ToggleButton'],
    [ElementType.Slider]: ['Slider'],
    [ElementType.DatePicker]: ['DatePicker'],
    [ElementType.TimePicker]: ['TimePicker'],
    [ElementType.FileUpload]: ['Button'],
    [ElementType.MapView]: ['Box'],
    [ElementType.VideoPlayer]: [],
    [ElementType.QRCode]: ['Box'],
    [ElementType.LoadingSpinner]: ['CircularProgress'],
  };
  
  return importMap[type] || [];
};

// Generate JSX for an element and its children
const generateElementJSX = (element: EditorElement, allElements: { [key: string]: EditorElement }, indent = 0): string => {
  const componentName = getComponentName(element.type);
  const indentStr = '  '.repeat(indent);
  
  // Convert props to JSX props
  let jsxProps = '';
  const { children, content, text, ...otherProps } = element.props as any;
  
  if (Object.keys(otherProps).length > 0) {
    jsxProps = ' ' + propsToString(otherProps);
  }
  
  // Handle different element types
  let elementContent = '';
  
  if (element.type === ElementType.Text && content) {
    elementContent = content;
  } else if (element.type === ElementType.Button && text) {
    elementContent = text;
  } else if (children && Array.isArray(children)) {
    // Render child elements
    const childElements = children
      .map(childId => allElements[childId])
      .filter(Boolean)
      .map(child => generateElementJSX(child, allElements, indent + 1))
      .join('\n');
    
    if (childElements) {
      elementContent = '\n' + childElements + '\n' + indentStr;
    }
  }
  
  // Generate the JSX
  if (elementContent) {
    return `${indentStr}<${componentName}${jsxProps}>\n${indentStr}  ${elementContent}\n${indentStr}</${componentName}>`;
  } else {
    return `${indentStr}<${componentName}${jsxProps} />`;
  }
};

// Generate React component code for a page
const generatePageComponent = (page: Page): string => {
  const rootElement = page.elements[page.rootElementId];
  if (!rootElement) return '';
  
  // Collect all required imports
  const allImports = new Set<string>();
  Object.values(page.elements).forEach(element => {
    getRequiredImports(element.type).forEach(imp => allImports.add(imp));
  });
  
  const imports = Array.from(allImports).sort();
  const importStatement = imports.length > 0 
    ? `import { ${imports.join(', ')} } from '@mui/material';\n`
    : '';
  
  const jsxContent = generateElementJSX(rootElement, page.elements, 1);
  
  return `import React from 'react';
${importStatement}
const ${page.name.replace(/[^a-zA-Z0-9]/g, '')} = () => {
  return (
${jsxContent}
  );
};

export default ${page.name.replace(/[^a-zA-Z0-9]/g, '')};
`;
};

// Generate App.tsx that includes all pages
const generateAppComponent = (project: Project): string => {
  const pageImports = project.pages
    .map(page => `import ${page.name.replace(/[^a-zA-Z0-9]/g, '')} from './pages/${page.name.replace(/[^a-zA-Z0-9]/g, '')}';`)
    .join('\n');
  
  const routes = project.pages
    .map((page, index) => {
      const path = index === 0 ? '/' : `/${page.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      return `        <Route path="${path}" element={<${page.name.replace(/[^a-zA-Z0-9]/g, '')} />} />`;
    })
    .join('\n');
  
  return `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
${pageImports}

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
${routes}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
`;
};

// Generate package.json
const generatePackageJson = (project: Project): string => {
  return JSON.stringify({
    name: project.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    version: '0.1.0',
    private: true,
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'react-router-dom': '^6.25.1',
      '@mui/material': '^5.14.0',
      '@emotion/react': '^11.11.0',
      '@emotion/styled': '^11.11.0',
      '@mui/icons-material': '^5.14.0'
    },
    scripts: {
      'start': 'react-scripts start',
      'build': 'react-scripts build',
      'test': 'react-scripts test',
      'eject': 'react-scripts eject'
    },
    devDependencies: {
      'react-scripts': '^5.0.1',
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      'typescript': '^4.9.0'
    },
    browserslist: {
      production: [
        '>0.2%',
        'not dead',
        'not op_mini all'
      ],
      development: [
        'last 1 chrome version',
        'last 1 firefox version',
        'last 1 safari version'
      ]
    }
  }, null, 2);
};

// Generate index.tsx
const generateIndexTsx = (): string => {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
};

// Generate index.html
const generateIndexHtml = (project: Project): string => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="${project.description}" />
    <title>${project.name}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`;
};

// Generate README.md
const generateReadme = (project: Project): string => {
  return `# ${project.name}

${project.description}

## Getting Started

This project was generated from a visual website builder.

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Extract the project files
2. Navigate to the project directory
3. Install dependencies:

\`\`\`bash
npm install
\`\`\`

### Running the Project

To start the development server:

\`\`\`bash
npm start
\`\`\`

The app will open in your browser at [http://localhost:3000](http://localhost:3000).

### Building for Production

To build the project for production:

\`\`\`bash
npm run build
\`\`\`

The build files will be in the \`build\` directory.

## Project Structure

- \`src/App.tsx\` - Main application component with routing
- \`src/pages/\` - Individual page components
- \`public/\` - Static assets
- \`package.json\` - Project dependencies and scripts

## Available Scripts

- \`npm start\` - Runs the app in development mode
- \`npm run build\` - Builds the app for production
- \`npm test\` - Launches the test runner
- \`npm run eject\` - Ejects from Create React App (one-way operation)

Generated on ${new Date().toLocaleDateString()}
`;
};

// Main function to generate complete React project
export const generateReactProject = (project: Project): { [filename: string]: string } => {
  const files: { [filename: string]: string } = {};
  
  // Generate package.json
  files['package.json'] = generatePackageJson(project);
  
  // Generate index.html
  files['public/index.html'] = generateIndexHtml(project);
  
  // Generate src/index.tsx
  files['src/index.tsx'] = generateIndexTsx();
  
  // Generate src/App.tsx
  files['src/App.tsx'] = generateAppComponent(project);
  
  // Generate page components
  project.pages.forEach(page => {
    const componentName = page.name.replace(/[^a-zA-Z0-9]/g, '');
    files[`src/pages/${componentName}.tsx`] = generatePageComponent(page);
  });
  
  // Generate README.md
  files['README.md'] = generateReadme(project);
  
  return files;
};
