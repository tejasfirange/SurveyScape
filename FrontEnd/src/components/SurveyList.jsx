import React, { useState, useEffect } from 'react';
import { fetchUserSurveys, deleteSurvey } from '../services/surveyService';
import { Box, CircularProgress, IconButton, Tooltip, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DeleteIcon from '@mui/icons-material/Delete';

const SurveyList = () => {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [surveyToDelete, setSurveyToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSurveys = async () => {
            try {
                const userSurveys = await fetchUserSurveys();
                setSurveys(userSurveys || []);
                setLoading(false);
            } catch (err) {
                console.error('Failed to load surveys:', err);
                setError('Failed to load surveys. Please try again later.');
                setLoading(false);
            }
        };

        loadSurveys();
    }, []);

    const handleCopyLink = (surveyId, event) => {
        event.stopPropagation();
        const surveyUrl = `${window.location.origin}/fill-survey/${surveyId}`;
        navigator.clipboard.writeText(surveyUrl);
        // You could add a toast notification here
    };

    const handleEdit = (surveyId, event) => {
        event.stopPropagation();
        navigate(`/edit-survey/${surveyId}`);
    };

    const handleAnalytics = (surveyId, event) => {
        event.stopPropagation();
        navigate(`/survey-analytics/${surveyId}`);
    };

    const handleDeleteClick = (surveyId, event) => {
        event.stopPropagation();
        setSurveyToDelete(surveyId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteSurvey(surveyToDelete);
            setSurveys(surveys.filter(survey => survey.id !== surveyToDelete));
            setDeleteDialogOpen(false);
            setSurveyToDelete(null);
        } catch (error) {
            console.error('Failed to delete survey:', error);
            setError('Failed to delete survey. Please try again.');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSurveyToDelete(null);
    };

    const toggleSurveyStatus = async (surveyId, currentStatus, event) => {
        event.stopPropagation();
        try {
            const response = await fetch(`/survey/toggle-status/${surveyId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ is_active: !currentStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to toggle survey status');
            }

            // Update local state
            setSurveys(surveys.map(survey => 
                survey.id === surveyId 
                    ? { ...survey, is_active: !survey.is_active }
                    : survey
            ));
        } catch (error) {
            console.error('Error toggling survey status:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress sx={{ color: 'white' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                p: 4,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                textAlign: 'center',
                color: '#ff6b6b'
            }}>
                {error}
            </Box>
        );
    }

    if (!surveys || surveys.length === 0) {
        return (
            <Box sx={{ 
                p: 6,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
            }}>
                <Box sx={{ 
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white'
                }}>
                    No Surveys Yet
                </Box>
                <Box sx={{ 
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.8)'
                }}>
                    Create your first survey to get started!
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 3
        }}>
            {surveys.map((survey) => (
                <Box 
                    key={survey.id} 
                    onClick={() => navigate(`/survey-details/${survey.id}`)}
                    sx={{
                        p: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        transition: 'all 0.2s ease-in-out',
                        cursor: 'pointer',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            bgcolor: 'rgba(255, 255, 255, 0.15)'
                        }
                    }}
                >
                    <Box sx={{ 
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'white',
                        mb: 2
                    }}>
                        {survey.title}
                    </Box>
                    <Box sx={{ 
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 1
                    }}>
                        Created: {new Date(survey.created_at).toLocaleDateString()}
                    </Box>
                    <Box sx={{ 
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 1
                    }}>
                        Questions: {survey.questions ? survey.questions.length : 0}
                    </Box>
                    <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 2,
                        cursor: 'pointer'
                    }}
                    onClick={(e) => toggleSurveyStatus(survey.id, survey.is_active, e)}
                    >
                        <Box sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: survey.is_active ? '#4CAF50' : '#f44336',
                            transition: 'background-color 0.3s ease'
                        }} />
                        Status: {survey.is_active ? 'Active' : 'Inactive'}
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1,
                        mt: 2
                    }}>
                        <Tooltip title="Copy Survey Link">
                            <IconButton
                                onClick={(e) => handleCopyLink(survey.id, e)}
                                sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                                }}
                                size="small"
                            >
                                <ContentCopyIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Survey">
                            <IconButton
                                onClick={(e) => handleEdit(survey.id, e)}
                                sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                                }}
                                size="small"
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="View Analysis">
                            <IconButton
                                onClick={(e) => handleAnalytics(survey.id, e)}
                                sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                                }}
                                size="small"
                            >
                                <AnalyticsIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Survey">
                            <IconButton
                                onClick={(e) => handleDeleteClick(survey.id, e)}
                                sx={{
                                    color: '#ff6b6b',
                                    bgcolor: 'rgba(255, 99, 99, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(255, 99, 99, 0.2)' }
                                }}
                                size="small"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            ))}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                PaperProps={{
                    sx: {
                        bgcolor: '#2A2A2A',
                        color: 'white',
                        minWidth: '300px'
                    }
                }}
            >
                <DialogTitle>Delete Survey</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this survey? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button 
                        onClick={handleDeleteCancel}
                        sx={{ 
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm}
                        sx={{ 
                            bgcolor: '#ff4444',
                            color: 'white',
                            '&:hover': { bgcolor: '#ff6666' }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SurveyList; 