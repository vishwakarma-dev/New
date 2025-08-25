
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Box, Typography, Container, createTheme, ThemeProvider } from '@mui/material';
import RenderedElement from '../components/editor/RenderedElement';

const PreviewPage: React.FC = () => {
    const { projectId, pageId } = useParams<{ projectId: string; pageId: string }>();
    const project = useSelector((state: RootState) => state.projects.projects.find(p => p.id === projectId));
    const page = project?.pages.find(p => p.id === pageId);

    const dynamicTheme = useMemo(() => {
        if (!page?.theme) return createTheme(); // default theme
        
        return createTheme({
            spacing: page.theme.spacingUnit ?? 8,
            typography: {
                fontFamily: page.theme.fontFamily || 'Roboto, sans-serif',
            },
            shape: {
                borderRadius: page.theme.borderRadius ?? 8,
            },
            palette: {
                primary: {
                    main: page.theme.primaryColor || '#1976d2',
                },
                secondary: {
                    main: page.theme.secondaryColor || '#dc004e',
                },
                background: {
                    default: '#f7f9fc',
                    paper: page.theme.backgroundColor || '#ffffff',
                }
            },
            components: {
                MuiButtonBase: {
                    defaultProps: {
                        disableRipple: true,
                    },
                },
            }
        });
    }, [page?.theme]);

    if (!page) {
        return (
            <Container>
                <Box sx={{ py: 5, textAlign: 'center' }}>
                    <Typography variant="h4">Page Not Found</Typography>
                    <Typography color="text.secondary">The page you are looking for does not exist.</Typography>
                </Box>
            </Container>
        )
    }

    const rootElement = page.elements[page.rootElementId];

    return (
        <ThemeProvider theme={dynamicTheme}>
            <Box sx={{ bgcolor: 'background.paper' }}>
                {rootElement && (
                    <RenderedElement
                        element={rootElement}
                        allElements={page.elements}
                        page={page}
                        rootElementId={page.rootElementId}
                        selectedElementId={null}
                        onSelectElement={() => {}}
                        onMoveElement={() => {}}
                        isReadOnly
                    />
                )}
            </Box>
        </ThemeProvider>
    );
};

export default PreviewPage;
