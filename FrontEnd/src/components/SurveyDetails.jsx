import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchSurveyById } from '../services/surveyService';

const SurveyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const loadSurvey = async () => {
            try {
                const data = await fetchSurveyById(id);
                setSurvey(data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to load survey:', err);
                setError('Failed to load survey details.');
                setLoading(false);
            }
        };

        loadSurvey();
    }, [id]);

    const handleCopyLink = () => {
        const surveyUrl = `${window.location.origin}/fill-msurvey/${id}`;
        navigator.clipboard.writeText(surveyUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress sx={{ color: 'white' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                p: 4,
                color: '#ff6b6b',
                textAlign: 'center'
            }}>
                {error}
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #2D1B33 0%, #8B1EDE 100%)',
            color: 'white'
        }}>
            {/* Header */}
            <Box sx={{ 
                width: '100%', 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton 
                        onClick={() => navigate('/dashboard')}
                        sx={{ color: 'white' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Box sx={{ fontSize: '24px', fontWeight: 'bold' }}>
                        Survey Details
                    </Box>
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
                <Box sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    p: 4,
                    mb: 4
                }}>
                    <Box sx={{ 
                        fontSize: '28px',
                        fontWeight: 'bold',
                        mb: 3
                    }}>
                        {survey?.title}
                    </Box>
                    <Box sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 4
                    }}>
                        {survey?.description}
                    </Box>
                    
                    <Box sx={{ 
                        display: 'flex',
                        gap: 2,
                        flexWrap: 'wrap'
                    }}>
                        <Button
                            onClick={() => navigate(`/edit-survey/${id}`)}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.3)'
                                },
                                px: 3,
                                py: 1
                            }}
                        >
                            Edit Survey
                        </Button>
                        <Button
                            onClick={() => navigate(`/survey-analytics/${id}`)}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.3)'
                                },
                                px: 3,
                                py: 1
                            }}
                        >
                            View Analytics
                        </Button>
                        <Button
                            onClick={handleCopyLink}
                            startIcon={<ContentCopyIcon />}
                            sx={{
                                bgcolor: copied ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: copied ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'
                                },
                                px: 3,
                                py: 1
                            }}
                        >
                            {copied ? 'Link Copied!' : 'Copy Survey Link'}
                        </Button>
                    </Box>
                </Box>

                {/* Questions Preview */}
                <Box sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    p: 4
                }}>
                    <Box sx={{ 
                        fontSize: '20px',
                        fontWeight: 'bold',
                        mb: 3
                    }}>
                        Questions
                    </Box>
                    {survey?.questions.map((question, index) => (
                        <Box 
                            key={index}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '8px',
                                p: 3,
                                mb: 2
                            }}
                        >
                            <Box sx={{ 
                                fontSize: '16px',
                                fontWeight: 'bold',
                                mb: 1
                            }}>
                                {index + 1}. {question.text}
                            </Box>
                            <Box sx={{ 
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '14px'
                            }}>
                                Type: {question.type}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default SurveyDetails; 