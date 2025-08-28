import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  MoreVert,
  Search,
  FilterList,
  Image,
  VideoLibrary,
  AudioFile,
  InsertDriveFile,
  Download
} from '@mui/icons-material';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  size: number;
  uploadDate: Date;
  thumbnail?: string;
}

const MediaPanel: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'audio' | 'document'>('all');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        const mediaFile: MediaFile = {
          id: Date.now() + Math.random().toString(),
          name: file.name,
          type: getFileType(file.type),
          url: URL.createObjectURL(file),
          size: file.size,
          uploadDate: new Date(),
          thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        };
        
        setMediaFiles(prev => [mediaFile, ...prev]);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getFileType = (mimeType: string): MediaFile['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return <Image />;
      case 'video': return <VideoLibrary />;
      case 'audio': return <AudioFile />;
      default: return <InsertDriveFile />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = (file: MediaFile) => {
    setSelectedFile(file);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedFile) {
      setMediaFiles(prev => prev.filter(f => f.id !== selectedFile.id));
      URL.revokeObjectURL(selectedFile.url);
      if (selectedFile.thumbnail) {
        URL.revokeObjectURL(selectedFile.thumbnail);
      }
    }
    setDeleteDialogOpen(false);
    setSelectedFile(null);
  };

  const handleDragStart = (e: React.DragEvent, file: MediaFile) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('mediaFile', JSON.stringify(file));
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const typeFilters = [
    { key: 'all', label: 'All', icon: <FilterList /> },
    { key: 'image', label: 'Images', icon: <Image /> },
    { key: 'video', label: 'Videos', icon: <VideoLibrary /> },
    { key: 'audio', label: 'Audio', icon: <AudioFile /> },
    { key: 'document', label: 'Documents', icon: <InsertDriveFile /> },
  ];

  return (
    <Box sx={{ p: 2 }}>
      {/* Upload Section */}
      <Box sx={{ mb: 3 }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          style={{ display: 'none' }}
        />
        <Button
          variant="contained"
          fullWidth
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          sx={{ mb: 2 }}
        >
          {uploading ? 'Uploading...' : 'Upload Media Files'}
        </Button>
        
        {mediaFiles.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Upload images, videos, audio files, and documents to use in your project.
          </Alert>
        )}
      </Box>

      {/* Search and Filter */}
      {mediaFiles.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search media files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
            }}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {typeFilters.map(filter => (
              <Chip
                key={filter.key}
                icon={filter.icon}
                label={filter.label}
                variant={filterType === filter.key ? 'filled' : 'outlined'}
                color={filterType === filter.key ? 'primary' : 'default'}
                size="small"
                onClick={() => setFilterType(filter.key as any)}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Media Grid */}
      <Grid container spacing={2}>
        {filteredFiles.map(file => (
          <Grid key={file.id} item xs={12} sm={6}>
            <Card
              draggable
              onDragStart={(e) => handleDragStart(e, file)}
              sx={{
                cursor: 'grab',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                },
                '&:active': {
                  cursor: 'grabbing'
                }
              }}
            >
              {file.type === 'image' && file.thumbnail ? (
                <CardMedia
                  component="img"
                  height="120"
                  image={file.thumbnail}
                  alt={file.name}
                  sx={{ objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100',
                    color: 'grey.600'
                  }}
                >
                  {React.cloneElement(getFileIcon(file.type), { sx: { fontSize: 48 } })}
                </Box>
              )}
              
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Tooltip title={file.name}>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {file.name}
                      </Typography>
                    </Tooltip>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(file.size)}
                    </Typography>
                  </Box>
                  
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuAnchor(e.currentTarget);
                      setSelectedFile(file);
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            if (selectedFile) {
              const link = document.createElement('a');
              link.href = selectedFile.url;
              link.download = selectedFile.name;
              link.click();
            }
            setMenuAnchor(null);
          }}
        >
          <Download sx={{ mr: 1 }} />
          Download
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedFile) {
              handleDelete(selectedFile);
            }
            setMenuAnchor(null);
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Media File</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedFile?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MediaPanel;
