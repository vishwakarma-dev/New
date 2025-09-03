import React, { useMemo, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Tooltip } from '@mui/material';
import { Restore, Save } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { savePageVersion, restorePageVersion } from '../../store/projectsSlice';

const HistoryPanel: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { projectId, currentPageId } = useSelector((s: RootState) => s.editor);
  const project = useSelector((s: RootState) => s.projects.projects.find(p => p.id === projectId));
  const page = useMemo(() => project?.pages.find(p => p.id === currentPageId), [project, currentPageId]);

  const [name, setName] = useState('');

  const handleSave = () => {
    if (!projectId || !currentPageId) return;
    dispatch(savePageVersion({ projectId, pageId: currentPageId, name: name.trim() || undefined }));
    setName('');
  };

  const handleRestore = (versionId: string) => {
    if (!projectId || !currentPageId) return;
    dispatch(restorePageVersion({ projectId, pageId: currentPageId, versionId }));
  };

  return (
    <Box p={2} display="flex" flexDirection="column" height="100%" gap={1.5}>
      <Typography variant="overline" color="text.secondary">Save Snapshot</Typography>
      <Box display="flex" gap={1}>
        <TextField size="small" fullWidth placeholder="Snapshot name (optional)" value={name} onChange={e => setName(e.target.value)} />
        <Tooltip title="Save snapshot of current page">
          <span>
            <IconButton color="primary" onClick={handleSave}>
              <Save />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Typography variant="overline" color="text.secondary" sx={{ mt: 1 }}>History</Typography>
      <List dense sx={{ flex: 1, overflowY: 'auto' }}>
        {(page?.versions || []).slice().reverse().map(v => (
          <ListItem key={v.id} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <ListItemText
              primary={v.name}
              secondary={new Date(v.timestamp).toLocaleString()}
            />
            <ListItemSecondaryAction>
              <Tooltip title="Restore this version">
                <IconButton edge="end" onClick={() => handleRestore(v.id)}>
                  <Restore />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        {(!page?.versions || page.versions.length === 0) && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1.5 }}>No snapshots yet.</Typography>
        )}
      </List>
    </Box>
  );
};

export default HistoryPanel;
