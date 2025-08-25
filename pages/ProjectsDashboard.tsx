

import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { Project } from '../types';
import { Grid, Container, Box, Typography, Button, Checkbox, TextField, InputAdornment, Modal, Backdrop, Fade, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { deleteProject, updateProject, addProject, addGeneratedProject } from '../store/projectsSlice';
import GeminiChat from '../components/GeminiChat';

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

    return (
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
    );
};

export default ProjectsDashboard;