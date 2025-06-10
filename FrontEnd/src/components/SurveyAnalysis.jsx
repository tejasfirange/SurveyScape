import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { fetchSurveyById } from '../services/surveyService';
import { useAuth } from '../contexts/AuthContext';
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
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analysisData, setAnalysisData] = useState({});
    const [showDetails, setShowDetails] = useState(false);

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
        if (!surveyData.responses) return setAnalysisData(analysis);
        surveyData.questions.forEach((question, qIdx) => {
            if (
                question.type === 'radio' ||
                question.type === 'single-choice' ||
                question.type === 'checkbox' ||
                question.type === 'multiple-choice'
            ) {
                const responses = {};
                (question.options || []).forEach(option => {
                    responses[option] = 0;
                });
                surveyData.responses.forEach(response => {
                    // Find the answer for this question
                    let answerObj = response.responses?.find(a => a.questionId === qIdx);
                    let answer = answerObj ? answerObj.answer : undefined;
                    if (Array.isArray(answer)) {
                        answer.forEach(opt => {
                            if (responses[opt] !== undefined) responses[opt]++;
                        });
                    } else if (responses[answer] !== undefined) {
                        responses[answer]++;
                    }
                });
                const chartData = Object.entries(responses).map(([label, value]) => ({ label, value }));
                analysis[qIdx] = chartData;
            } else if (question.type === 'text') {
                // Collect all text answers
                const textAnswers = surveyData.responses
                    .map(response => {
                        let answerObj = response.responses?.find(a => a.questionId === qIdx);
                        return answerObj ? answerObj.answer : undefined;
                    })
                    .filter(ans => ans !== undefined && ans !== '');
                analysis[qIdx] = textAnswers;
            }
        });
        setAnalysisData(analysis);
    };

    const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, label, value }) => {
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 24;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text
                x={x}
                y={y}
                fill="#000"
                fontSize={18}
                fontWeight={700}
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {`${label}: ${value}`}
            </text>
        );
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

    const handleLogoClick = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    };

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
                <Typography
                    variant="h4"
                    sx={{ fontWeight: 'bold', color: 'white', cursor: 'pointer', userSelect: 'none' }}
                    onClick={handleLogoClick}
                >
                    SurveyScape
                </Typography>
                <button
                    style={{
                        background: '#8B1EDE',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        padding: '12px 28px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: 18,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                    onClick={() => setShowDetails(d => !d)}
                >
                    {showDetails ? 'Hide Graphical Details' : 'Show Graphical Details'}
                </button>
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
                        <Box key={index} sx={{ mb: 6 }}>
                            <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                                {index + 1}. {question.text}
                            </Typography>
                            {showDetails && (
                                <>
                                    {(question.type === 'radio' || question.type === 'single-choice') && analysisData[index]?.length > 0 && (
                                        <Box sx={{ height: 300, mb: 4 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={analysisData[index]}
                                                        dataKey="value"
                                                        nameKey="label"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={100}
                                                        fill="#8B1EDE"
                                                        label={renderPieLabel}
                                                    >
                                                        {analysisData[index].map((entry, idx) => (
                                                            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    )}
                                    {(question.type === 'checkbox' || question.type === 'multiple-choice') && analysisData[index]?.length > 0 && (
                                        <Box sx={{ height: 300, mb: 4 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={analysisData[index]}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="label" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar dataKey="value" fill="#8B1EDE" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    )}
                                </>
                            )}
                            {question.type === 'text' && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ color: 'white', mb: 1 }}>
                                        Text Responses:
                                    </Typography>
                                    {analysisData[index]?.length === 0 && (
                                        <Typography sx={{ color: 'white', opacity: 0.7 }}>No responses yet.</Typography>
                                    )}
                                    {analysisData[index]?.length > 0 && (
                                        <Box sx={{
                                            bgcolor: 'rgba(255,255,255,0.07)',
                                            borderRadius: 2,
                                            p: 2,
                                            maxHeight: 200,
                                            overflowY: 'auto',
                                            color: 'white'
                                        }}>
                                            {analysisData[index].map((resp, idx) => (
                                                <Typography key={idx} sx={{ mb: 1 }}>
                                                    {resp}
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}
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