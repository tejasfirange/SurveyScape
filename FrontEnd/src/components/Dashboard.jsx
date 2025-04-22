import React from 'react';
import { Box, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SurveyList from './SurveyList';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Show error message to user if needed
        }
    };

    // Extract first and last name from email
    const userName = user?.email ? user.email.split('@')[0].split('.').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') : '';

    return (
        <Box sx={{ 
            width: '100%', 
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
                <Box sx={{ 
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    fontFamily: "'Roboto Slab', serif"
                }}>
                    SurveyScape
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px'
                    }}>
                        {user?.email}
                    </Box>
                    <Button
                        onClick={handleLogout}
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.3)'
                            },
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 2,
                            py: 0.5
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ p: 4 }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 4
                }}>
                    <Box sx={{ 
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        Welcome, {userName}
                    </Box>
                    <Button
                        component={Link}
                        to="/create-survey"
                        sx={{
                            bgcolor: 'white',
                            color: '#8B1EDE',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.9)'
                            },
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 3,
                            py: 1,
                            fontWeight: 500
                        }}
                    >
                        Create New Survey
                    </Button>
                </Box>
                <SurveyList />
            </Box>
        </Box>
    );
};

export default Dashboard; 