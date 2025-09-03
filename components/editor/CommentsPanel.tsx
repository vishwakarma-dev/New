import React, { useMemo, useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Chip, List, ListItem, ListItemText, ListItemSecondaryAction, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked, Delete, Send, ArrowForward } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { addComment, updateComment, deleteComment } from '../../store/projectsSlice';
import { Comment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface CommentsPanelProps {
  selectedElementId: string | null;
}

const CommentsPanel: React.FC<CommentsPanelProps> = ({ selectedElementId }) => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useAuth();
  const { projectId, currentPageId } = useSelector((s: RootState) => s.editor);
  const project = useSelector((s: RootState) => s.projects.projects.find(p => p.id === projectId));
  const page = useMemo(() => project?.pages.find(p => p.id === currentPageId), [project, currentPageId]);

  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [text, setText] = useState('');

  const comments = useMemo(() => {
    const list = page?.comments || [];
    return list.filter(c => {
      if (filter === 'all') return true;
      return filter === 'open' ? !c.resolved : c.resolved;
    });
  }, [page?.comments, filter]);

  const handleAdd = () => {
    if (!text.trim() || !projectId || !currentPageId) return;
    const comment: Comment = {
      id: `c-${Date.now()}`,
      elementId: selectedElementId,
      author: user?.name || 'User',
      text: text.trim(),
      timestamp: Date.now(),
      resolved: false,
    };
    dispatch(addComment({ projectId, pageId: currentPageId, comment }));
    setText('');
  };

  const toggleResolved = (id: string, resolved: boolean) => {
    if (!projectId || !currentPageId) return;
    dispatch(updateComment({ projectId, pageId: currentPageId, commentId: id, changes: { resolved } }));
  };

  const handleDelete = (id: string) => {
    if (!projectId || !currentPageId) return;
    dispatch(deleteComment({ projectId, pageId: currentPageId, commentId: id }));
  };

  return (
    <Box p={2} display="flex" flexDirection="column" height="100%" gap={1.5}>
      <Typography variant="overline" color="text.secondary">Add Comment</Typography>
      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          size="small"
          placeholder={selectedElementId ? 'Comment on selected element' : 'General project comment'}
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <Tooltip title="Add comment">
          <span>
            <IconButton color="primary" onClick={handleAdd} disabled={!text.trim()}>
              <Send />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
        <Typography variant="overline" color="text.secondary">Comments</Typography>
        <ToggleButtonGroup size="small" value={filter} exclusive onChange={(_, v) => v && setFilter(v)}>
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="open">Open</ToggleButton>
          <ToggleButton value="resolved">Resolved</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <List dense sx={{ flex: 1, overflowY: 'auto' }}>
        {comments.map(c => (
          <ListItem key={c.id} alignItems="flex-start" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight="bold">{c.author}</Typography>
                  {c.elementId && <Chip label={`#${c.elementId.slice(-5)}`} size="small" />}
                  <Typography variant="caption" color="text.secondary">{new Date(c.timestamp).toLocaleString()}</Typography>
                </Box>
              }
              secondary={<Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{c.text}</Typography>}
            />
            <ListItemSecondaryAction>
              <Tooltip title={c.resolved ? 'Mark as open' : 'Mark as resolved'}>
                <IconButton edge="end" onClick={() => toggleResolved(c.id, !c.resolved)}>
                  {c.resolved ? <CheckCircle color="success" /> : <RadioButtonUnchecked />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton edge="end" onClick={() => handleDelete(c.id)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        {comments.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1.5 }}>No comments yet.</Typography>
        )}
      </List>
    </Box>
  );
};

export default CommentsPanel;
