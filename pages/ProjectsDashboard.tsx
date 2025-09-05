import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { Project } from '../types';
import {
  Grid,
  Container,
  Box,
  Typography,
  Button,
  Checkbox,
  TextField,
  InputAdornment,
  Modal,
  Backdrop,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Menu,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Search as SearchIcon,
  AutoAwesome as AutoAwesomeIcon,
  Web,
  AccountCircle,
  Logout,
  Settings,
  Person
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { deleteProject, updateProject, addProject, addGeneratedProject } from '../store/projectsSlice';
import { useAuth } from '../contexts/AuthContext';
import GeminiChat from '../components/GeminiChat';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};


const ProjectsDashboard: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const projects = useSelector((state: RootState) => state.projects.projects);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        status: 'Inactive' as 'Active' | 'Inactive' | 'New'
    });

    const [isNewProjectModalOpen, setNewProjectModalOpen] = useState(false);
    const [newProjectFormData, setNewProjectFormData] = useState({
        name: '',
        description: '',
        imageUrl: ''
    });

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

    const handleOpenEditModal = (project: Project) => {
        setEditingProject(project);
        setEditFormData({
            name: project.name,
            description: project.description,
            imageUrl: project.imageUrl,
            status: project.status,
        });
    };

    const handleCloseEditModal = () => {
        setEditingProject(null);
    };

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        setEditFormData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    };

    const handleSaveChanges = () => {
        if (editingProject) {
            dispatch(updateProject({ id: editingProject.id, changes: editFormData }));
            handleCloseEditModal();
        }
    };

    const handleDelete = (id: string) => {
        if(window.confirm('Are you sure you want to delete this project?')) {
            dispatch(deleteProject(id));
        }
    };

    const handleOpenNewProjectModal = () => {
        setNewProjectFormData({ name: '', description: '', imageUrl: '' });
        setNewProjectModalOpen(true);
    };

    const handleCloseNewProjectModal = () => {
        setNewProjectModalOpen(false);
    };

    const handleNewProjectFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewProjectFormData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    };

    const handleCreateProject = () => {
        if (!newProjectFormData.name) {
            alert('Project name is required.');
            return;
        }
        dispatch(addProject(newProjectFormData));
        handleCloseNewProjectModal();
    };

    const handleProjectGenerated = (projectData: { name: string; description: string; pages: any[]; }) => {
        dispatch(addGeneratedProject(projectData));
        setIsChatOpen(false);
    };

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };

    const handleLogout = () => {
        logout();
        handleUserMenuClose();
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Navigation Header */}
            <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}>
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                            <Web />
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold" color="white">
                            AppBuilder
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="white" sx={{ mr: 1 }}>
                            Welcome, {user?.name}!
                        </Typography>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="user-menu"
                            aria-haspopup="true"
                            onClick={handleUserMenuOpen}
                            color="inherit"
                        >
                            <Avatar
                                src={user?.avatar}
                                alt={user?.name}
                                sx={{ width: 32, height: 32 }}
                            >
                                {user?.name?.charAt(0)}
                            </Avatar>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* User Menu */}
            <Menu
                id="user-menu"
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                onClick={handleUserMenuClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleUserMenuClose}>
                    <ListItemIcon>
                        <Person fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleUserMenuClose}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Settings</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>

            <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box component="header" display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Checkbox aria-label="Select all projects" />
                    <Typography variant="h4" component="h1" fontWeight="bold">My Projects</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                    <Button onClick={() => setIsChatOpen(true)} variant="outlined" size="large" startIcon={<AutoAwesomeIcon />}>
                        Create with AI
                    </Button>
                    <Button onClick={handleOpenNewProjectModal} variant="contained" size="large">
                        New Project
                    </Button>
                </Box>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                <TextField 
                    placeholder="Search projects..."
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 2, bgcolor: 'background.paper', minWidth: 300 }
                    }}
                />
                 <Box display="flex" alignItems="center" gap={2}>
                    <Button variant="outlined" sx={{ bgcolor: 'background.paper' }}>All Statuses</Button>
                    <Button variant="outlined" sx={{ bgcolor: 'background.paper' }}>Sort by Newest</Button>
                </Box>
            </Box>

            <Grid container spacing={4}>
                {projects.map(project => (
                    <Grid key={project.id} size={{ xs:12, sm:6, md:4, lg:3 }} >
                        <ProjectCard 
                            project={project}
                            onEdit={() => handleOpenEditModal(project)}
                            onDelete={() => handleDelete(project.id)}
                        />
                    </Grid>
                ))}
            </Grid>
            
            <GeminiChat 
                open={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                onProjectGenerated={handleProjectGenerated}
            />

            {/* Edit Project Modal */}
            <Modal
                open={!!editingProject}
                onClose={handleCloseEditModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={!!editingProject}>
                    <Box sx={style}>
                        <Typography variant="h6" component="h2" mb={2}>
                            Edit Project Details
                        </Typography>
                        <TextField
                            fullWidth size="small" margin="dense" label="Project Name" name="name"
                            value={editFormData.name} onChange={handleFormChange}
                        />
                         <TextField
                            fullWidth size="small" multiline rows={3} margin="dense" label="Description" name="description"
                            value={editFormData.description} onChange={handleFormChange}
                        />
                         <TextField
                            fullWidth size="small" margin="dense" label="Image URL" name="imageUrl"
                            value={editFormData.imageUrl} onChange={handleFormChange}
                        />
                        <FormControl fullWidth margin="dense" size="small">
                            <InputLabel>Status</InputLabel>
                            <Select label="Status" name="status" value={editFormData.status} onChange={handleFormChange}>
                                <MenuItem value="New">New</MenuItem>
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>

                        <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                            <Button onClick={handleCloseEditModal}>Cancel</Button>
                            <Button variant="contained" onClick={handleSaveChanges}>Save Changes</Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {/* New Project Modal */}
            <Modal
                open={isNewProjectModalOpen}
                onClose={handleCloseNewProjectModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={isNewProjectModalOpen}>
                    <Box sx={style}>
                        <Typography variant="h6" component="h2" mb={2}>
                            Create New Project
                        </Typography>
                        <TextField
                            fullWidth size="small" required margin="dense" label="Project Name" name="name"
                            value={newProjectFormData.name} onChange={handleNewProjectFormChange}
                        />
                         <TextField
                            fullWidth size="small" multiline rows={3} margin="dense" label="Description" name="description"
                            value={newProjectFormData.description} onChange={handleNewProjectFormChange}
                        />
                         <TextField
                            fullWidth size="small" margin="dense" label="Image URL" name="imageUrl"
                            value={newProjectFormData.imageUrl} onChange={handleNewProjectFormChange}
                            helperText="Leave blank for a default image."
                        />
                        <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                            <Button onClick={handleCloseNewProjectModal}>Cancel</Button>
                            <Button variant="contained" onClick={handleCreateProject}>Create Project</Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            </Container>
        </Box>
    );
};

export default ProjectsDashboard;
