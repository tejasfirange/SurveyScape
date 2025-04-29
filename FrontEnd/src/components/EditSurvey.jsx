import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, CircularProgress, IconButton } from '@mui/material';
import { fetchSurveyById, updateSurvey } from '../services/surveyService';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const EditSurvey = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [surveyData, setSurveyData] = useState({
        title: '',
        description: '',
        questions: []
    });

    useEffect(() => {
        const loadSurvey = async () => {
            try {
                const survey = await fetchSurveyById(id);
                // Map radio to single-choice and checkbox to multiple-choice
                const mappedQuestions = survey.questions.map(q => ({
                    ...q,
                    type: q.type === 'radio' ? 'single-choice' : 
                          q.type === 'checkbox' ? 'multiple-choice' : q.type,
                    options: q.options || []
                }));
                setSurveyData({...survey, questions: mappedQuestions});
                setLoading(false);
            } catch (err) {
                console.error('Error loading survey:', err);
                setError('Failed to load survey. Please try again later.');
                setLoading(false);
            }
        };

        loadSurvey();
    }, [id]);

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...surveyData.questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value,
            // Initialize options array if switching to choice type
            options: field === 'type' && 
                    (value === 'single-choice' || value === 'multiple-choice') && 
                    !updatedQuestions[index].options ? 
                    [''] : updatedQuestions[index].options
        };
        setSurveyData({ ...surveyData, questions: updatedQuestions });
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...surveyData.questions];
        const options = [...updatedQuestions[questionIndex].options];
        options[optionIndex] = value;
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            options
        };
        setSurveyData({ ...surveyData, questions: updatedQuestions });
    };

    const addOption = (questionIndex) => {
        const updatedQuestions = [...surveyData.questions];
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            options: [...(updatedQuestions[questionIndex].options || []), '']
        };
        setSurveyData({ ...surveyData, questions: updatedQuestions });
    };

    const removeOption = (questionIndex, optionIndex) => {
        const updatedQuestions = [...surveyData.questions];
        const options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            options
        };
        setSurveyData({ ...surveyData, questions: updatedQuestions });
    };

    const addQuestion = () => {
        setSurveyData({
            ...surveyData,
            questions: [
                ...surveyData.questions,
                { text: '', type: 'text', options: [] }
            ]
        });
    };

    const removeQuestion = (index) => {
        const updatedQuestions = surveyData.questions.filter((_, i) => i !== index);
        setSurveyData({ ...surveyData, questions: updatedQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Map single-choice to radio and multiple-choice to checkbox before saving
            const mappedQuestions = surveyData.questions.map(q => ({
                ...q,
                type: q.type === 'single-choice' ? 'radio' : 
                      q.type === 'multiple-choice' ? 'checkbox' : q.type
            }));
            await updateSurvey(id, {...surveyData, questions: mappedQuestions});
            navigate('/dashboard');
        } catch (err) {
            console.error('Error updating survey:', err);
            setError('Failed to update survey. Please try again.');
        }
    };

    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                background: '#2D1B33',
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
                minHeight: '100vh',
                background: '#2D1B33',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white'
            }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: '#2D1B33',
            color: 'white',
            p: 0
        }}>
            {/* Header */}
            <Box sx={{
                p: 2,
                bgcolor: '#8B1EDE',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    SurveyScape
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography>{localStorage.getItem('userEmail')}</Typography>
                    <Button
                        onClick={() => navigate('/dashboard')}
                        sx={{
                            color: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                        }}
                    >
                        Back to Dashboard
                    </Button>
                </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ maxWidth: '800px', mx: 'auto', p: 4 }}>
                <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', color: 'white' }}>
                    Edit Survey
                </Typography>

                <Box sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    p: 4
                }}>
                    <form onSubmit={handleSubmit}>
                        <Typography sx={{ mb: 2, color: 'white' }}>Survey Title</Typography>
                        <input
                            value={surveyData.title}
                            onChange={(e) => setSurveyData({ ...surveyData, title: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '4px',
                                color: 'white',
                                marginBottom: '20px'
                            }}
                        />

                        <Typography sx={{ mb: 2, color: 'white' }}>Survey Description</Typography>
                        <textarea
                            value={surveyData.description}
                            onChange={(e) => setSurveyData({ ...surveyData, description: e.target.value })}
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '4px',
                                color: 'white',
                                marginBottom: '20px',
                                resize: 'vertical'
                            }}
                        />

                        <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>Questions</Typography>
                        {surveyData.questions.map((question, index) => (
                            <Box
                                key={index}
                                sx={{
                                    mb: 3,
                                    p: 3,
                                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: 2,
                                    position: 'relative'
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography sx={{ color: 'white' }}>Question {index + 1}</Typography>
                                    <Button
                                        onClick={() => removeQuestion(index)}
                                        sx={{
                                            color: '#ff6b6b',
                                            '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' }
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </Box>

                                <Typography sx={{ mb: 1, color: 'white' }}>Question Text</Typography>
                                <input
                                    value={question.text}
                                    onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '4px',
                                        color: 'white',
                                        marginBottom: '20px'
                                    }}
                                />

                                <Typography sx={{ mb: 1, color: 'white' }}>Question Type</Typography>
                                <select
                                    value={question.type}
                                    onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        backgroundColor: 'white',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '4px',
                                        color: 'black',
                                        cursor: 'pointer',
                                        marginBottom: '20px'
                                    }}
                                >
                                    <option value="text">Text</option>
                                    <option value="single-choice">Single Choice</option>
                                    <option value="multiple-choice">Multiple Choice</option>
                                </select>

                                {(question.type === 'single-choice' || question.type === 'multiple-choice') && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography sx={{ mb: 1, color: 'white' }}>Options</Typography>
                                        {question.options?.map((option, optionIndex) => (
                                            <Box key={optionIndex} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                                <input
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '10px',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                        borderRadius: '4px',
                                                        color: 'white'
                                                    }}
                                                    placeholder={`Option ${optionIndex + 1}`}
                                                />
                                                <IconButton
                                                    onClick={() => removeOption(index, optionIndex)}
                                                    sx={{ color: '#ff6b6b' }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        ))}
                                        <Button
                                            onClick={() => addOption(index)}
                                            startIcon={<AddIcon />}
                                            sx={{
                                                color: 'white',
                                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                                            }}
                                        >
                                            Add Option
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        ))}

                        <Button
                            onClick={addQuestion}
                            sx={{
                                bgcolor: '#8B1EDE',
                                color: 'white',
                                mb: 4,
                                '&:hover': { bgcolor: '#7B1ACD' }
                            }}
                        >
                            Add Question
                        </Button>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                onClick={() => navigate('/dashboard')}
                                sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                sx={{
                                    bgcolor: '#8B1EDE',
                                    color: 'white',
                                    '&:hover': { bgcolor: '#7B1ACD' }
                                }}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default EditSurvey; 