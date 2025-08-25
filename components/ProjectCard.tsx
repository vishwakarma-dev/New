
import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { Card, CardMedia, CardContent, Typography, Box, Chip, CardActions, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface ProjectCardProps {
    project: Project;
    onEdit: () => void;
    onDelete: () => void;
}

const statusColors: { [key in Project['status']]: { color: 'success' | 'default' | 'info', bgColor: string }} = {
    'Active': { color: 'success', bgColor: 'rgba(46, 125, 50, 0.7)'},
    'Inactive': { color: 'default', bgColor: 'rgba(0,0,0,0.3)'},
    'New': { color: 'info', bgColor: 'rgba(2, 136, 209, 0.7)'}
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
    const statusStyle = statusColors[project.status];

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 4, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
             <Box sx={{ position: 'relative' }}>
                <Link to={`/editor/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <CardMedia
                        component="img"
                        height="160"
                        image={project.imageUrl}
                        alt={project.name}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            bgcolor: 'rgba(0,0,0,0.4)',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.2)',
                            }
                        }}
                    />
                    <Chip 
                        label={project.status}
                        color={statusStyle.color}
                        size="small"
                        sx={{ position: 'absolute', top: 12, right: 12, backdropFilter: 'blur(4px)', bgcolor: statusStyle.bgColor }} 
                    />
                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, p: 2, color: 'white' }}>
                         <Typography variant="h6" fontWeight="bold">{project.name}</Typography>
                         <Typography variant="body2" color="grey.300">Created: {project.createdAt}</Typography>
                    </Box>
                </Link>
            </Box>
            <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{
                    display: '-webkit-box',
                    '-webkit-line-clamp': '2',
                    '-webkit-box-orient': 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minHeight: '2.5rem'
                }}>
                    {project.description}
                </Typography>
            </CardContent>
            <CardActions sx={{ marginTop: 'auto', justifyContent: 'flex-end', pt: 0 }}>
                <IconButton aria-label="edit project" onClick={onEdit}>
                    <Edit />
                </IconButton>
                <IconButton aria-label="delete project" onClick={onDelete}>
                    <Delete />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default ProjectCard;