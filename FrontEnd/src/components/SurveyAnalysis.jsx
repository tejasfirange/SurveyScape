import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { fetchSurveyById } from '../services/surveyService';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = ['#8B1EDE', '#6B15B0', '#4B0F82', '#2B0954', '#0B0326'];

const SurveyAnalysis = () => {
    const { id } = useParams();
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analysisData, setAnalysisData] = useState({});

    useEffect(() => {
        const loadSurvey = async () => {
            try {
                const surveyData = await fetchSurveyById(id);
                setSurvey(surveyData);
                analyzeResponses(surveyData);
            } catch (err) {
                setError('Failed to load survey data. Please try again later.');
                console.error('Error loading survey:', err);
            } finally {
                setLoading(false);
            }
        };

        loadSurvey();
    }, [id]);

    const analyzeResponses = (surveyData) => {
        const analysis = {};
        
        surveyData.questions.forEach((question) => {
            if (question.type === 'radio' || question.type === 'single-choice' ||
                question.type === 'checkbox' || question.type === 'multiple-choice') {
                const responses = {};
                
                // Initialize counters for each option
                question.options.forEach(option => {
                    responses[option] = 0;
                });

                // Count responses
                surveyData.responses.forEach(response => {
                    const answer = response.answers.find(a => a.questionId === question.id)?.answer;
                    if (Array.isArray(answer)) {
                        answer.forEach(opt => {
                            if (responses[opt] !== undefined) {
                                responses[opt]++;
                            }
                        });
                    } else if (responses[answer] !== undefined) {
                        responses[answer]++;
                    }
                });

                // Convert to chart data format
                const chartData = Object.entries(responses).map(([label, value]) => ({
                    label,
                    value
                }));

                analysis[question.id] = chartData;
            }
        });

        setAnalysisData(analysis);
    };

    if (loading) {
        return (
            <Box sx={{
                width: '100%',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #2D1B33 0%, #8B1EDE 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <CircularProgress sx={{ color: 'white' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                width: '100%',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #2D1B33 0%, #8B1EDE 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            width: '100%',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #2D1B33 0%, #8B1EDE 100%)',
            py: 8
        }}>
            {/* Header */}
            <Box sx={{
                width: '100%',
                p: 2,
                position: 'fixed',
                top: 0,
                left: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                zIndex: 1000
            }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                    SurveyScape
                </Typography>
            </Box>

            {/* Main Content */}
            <Box sx={{
                maxWidth: '1200px',
                mx: 'auto',
                px: 4,
                mt: 8
            }}>
                <Box sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    p: 6,
                    backdropFilter: 'blur(10px)'
                }}>
                    <Typography variant="h4" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
                        {survey?.title} - Analysis
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', mb: 6, textAlign: 'center' }}>
                        Total Responses: {survey?.responses?.length || 0}
                    </Typography>

                    {survey?.questions.map((question, index) => (
                        <Box key={question.id} sx={{ mb: 6 }}>
                            <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                                {index + 1}. {question.text}
                            </Typography>

                            {(question.type === 'radio' || question.type === 'single-choice') && (
                                <Box sx={{ height: 300, mb: 4 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={analysisData[question.id] || []}
                                                dataKey="value"
                                                nameKey="label"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                fill="#8B1EDE"
                                                label={({ label, value }) => `${label}: ${value}`}
                                            >
                                                {(analysisData[question.id] || []).map((entry, index) => (
                                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            )}

                            {(question.type === 'checkbox' || question.type === 'multiple-choice') && (
                                <Box sx={{ height: 300, mb: 4 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={analysisData[question.id] || []}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="label" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#8B1EDE" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default SurveyAnalysis; 