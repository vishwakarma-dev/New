import React, { useState } from 'react';
import { DataSource } from '../../types';
import { Grid, Box, Typography, TextField, Button, CircularProgress, Paper, IconButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore, Delete, CheckCircle, Error } from '@mui/icons-material';

interface DataPanelProps {
    dataSources: DataSource[];
    onAddDataSource: (name: string, url: string) => void;
    onDeleteDataSource: (id: string) => void;
}

const DataPanel: React.FC<DataPanelProps> = ({ dataSources, onAddDataSource, onDeleteDataSource }) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');

    const handleAddClick = () => {
        if (name.trim() && url.trim()) {
            onAddDataSource(name, url);
            setName('');
            setUrl('');
        }
    };

    return (
        <Box p={2}>
            <Typography variant="overline" display="block" sx={{ mb: 1 }}>Add New Data Source</Typography>
            <Paper variant="outlined" sx={{ p: 2, borderColor: 'divider' }}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <TextField label="Name" value={name} onChange={e => setName(e.target.value)} size="small" fullWidth />
                    </Grid>
                    <Grid size={12}>
                        <TextField label="API URL" value={url} onChange={e => setUrl(e.target.value)} size="small" fullWidth />
                    </Grid>
                    <Grid size={12} display="flex" justifyContent="flex-end">
                        <Button variant="contained" onClick={handleAddClick} disabled={!name.trim() || !url.trim()}>Fetch & Add</Button>
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="overline" display="block" sx={{ mt: 3, mb: 1 }}>Available Data</Typography>
            <Box>
                {dataSources.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>No data sources added yet.</Typography>
                ) : (
                    dataSources.map(ds => (
                        <Accordion key={ds.id} sx={{ '&:before': { display: 'none' }, boxShadow: 'none', border: '1px solid', borderColor: 'divider', mb: 1, '&.Mui-expanded:first-of-type': { mt: 0 }, '&.Mui-expanded:last-of-type': { mb: 1 } }}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                    <Box display="flex" alignItems="center" gap={1} sx={{ overflow: 'hidden' }}>
                                        {ds.status === 'loading' && <CircularProgress size={16} />}
                                        {ds.status === 'success' && <CheckCircle color="success" fontSize="small" />}
                                        {ds.status === 'error' && <Error color="error" fontSize="small" />}
                                        <Typography variant="subtitle2" noWrap>{ds.name}</Typography>
                                    </Box>
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDeleteDataSource(ds.id); }}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ wordBreak: 'break-all' }}>URL: {ds.url}</Typography>
                                {ds.status === 'success' && ds.data && (
                                    <Paper variant="outlined" sx={{ p: 1, mt: 1, maxHeight: 300, overflow: 'auto', bgcolor: 'grey.50' }}>
                                        <pre style={{ margin: 0, fontSize: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                            <code>{JSON.stringify(ds.data, null, 2)}</code>
                                        </pre>
                                    </Paper>
                                )}
                                {ds.status === 'error' && ds.error && (
                                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                        Error: {ds.error}
                                    </Typography>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default DataPanel;
