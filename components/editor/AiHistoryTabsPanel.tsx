import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import AiChatPanel from './AiChatPanel';
import HistoryPanel from './HistoryPanel';

interface AiHistoryTabsPanelProps {
    // Props for AiChatPanel
    page: any;
    selectedElementId: string | null;
    onUpdateElementProp: (elementId: string, prop: any, value: any) => void;
    onDeleteElement: (elementId: string) => void;
    onAddElement: (parentId: string, element: any, index: number) => void;
    onSelectElement: (id: string) => void;
}

const AiHistoryTabsPanel: React.FC<AiHistoryTabsPanelProps> = (props) => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Tabs Header */}
            <Tabs value={tabIndex} onChange={handleChange} variant="fullWidth">
                <Tab label="AI Assistant" />
                <Tab label="History" />
            </Tabs>

            {/* Tab Panels */}
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                {tabIndex === 0 && (
                    <Box sx={{ height: '100%' }}>
                        <AiChatPanel
                            page={props.page}
                            selectedElementId={props.selectedElementId}
                            onUpdateElementProp={props.onUpdateElementProp}
                            onDeleteElement={props.onDeleteElement}
                            onAddElement={props.onAddElement}
                            onSelectElement={props.onSelectElement}
                        />
                    </Box>
                )}
                {tabIndex === 1 && (
                    <Box sx={{ height: '100%' }}>
                        <HistoryPanel />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default AiHistoryTabsPanel;
