import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSurveyById, submitSurveyResponse } from '../services/surveyService';
import { Box, CircularProgress } from '@mui/material';

const SurveyFill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        const surveyData = await fetchSurveyById(id);
        setSurvey(surveyData);
        // Initialize responses object with empty values
        const initialResponses = {};
        surveyData.questions.forEach(question => {
          initialResponses[question.id] = '';
        });
        setResponses(initialResponses);
      } catch (err) {
        setError('Failed to load survey. Please try again later.');
        console.error('Error loading survey:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSurvey();
  }, [id]);

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formattedResponses = Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer
      }));

      await submitSurveyResponse(id, formattedResponses);
      alert('Survey submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to submit survey. Please try again.');
      console.error('Error submitting survey:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        width: '100%', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #2D1B33 0%, #8B1EDE 100%)',
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Box sx={{ 
          p: 4,
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          textAlign: 'center',
          color: '#ff6b6b'
        }}>
          {error}
        </Box>
      </Box>
    );
  }

  if (!survey) {
    return (
      <Box sx={{ 
        width: '100%', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #2D1B33 0%, #8B1EDE 100%)',
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Box sx={{ 
          p: 4,
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          textAlign: 'center',
          color: '#ffd700'
        }}>
          Survey not found
        </Box>
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
        <Box sx={{ 
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          fontFamily: "'Roboto Slab', serif"
        }}>
          SurveyScape
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        maxWidth: '800px', 
        mx: 'auto', 
        px: 4, 
        mt: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Box sx={{
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          p: 6,
          backdropFilter: 'blur(10px)',
          width: '100%'
        }}>
          <Box sx={{ 
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white',
            mb: 4,
            textAlign: 'center'
          }}>
            {survey.title}
          </Box>
          <Box sx={{ 
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            mb: 6,
            textAlign: 'center'
          }}>
            {survey.description}
          </Box>

          <form onSubmit={handleSubmit}>
            {survey.questions.map((question, index) => (
              <Box key={question.id} sx={{ mb: 6 }}>
                <Box sx={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'white',
                  mb: 2
                }}>
                  {index + 1}. {question.text}
                </Box>
                {question.type === 'text' && (
                  <input
                    type="text"
                    value={responses[question.id] || ''}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '12px',
                      outline: 'none'
                    }}
                    required
                  />
                )}
                {(question.type === 'radio' || question.type === 'single-choice') && question.options && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, ml: 4 }}>
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.15)'
                        }
                      }}>
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={responses[question.id] === option}
                          onChange={(e) => handleResponseChange(question.id, e.target.value)}
                          required
                          style={{ marginRight: '12px' }}
                        />
                        {option}
                      </label>
                    ))}
                  </Box>
                )}
                {(question.type === 'checkbox' || question.type === 'multiple-choice') && question.options && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, ml: 4 }}>
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.15)'
                        }
                      }}>
                        <input
                          type="checkbox"
                          value={option}
                          checked={responses[question.id]?.includes(option)}
                          onChange={(e) => {
                            const currentResponses = responses[question.id] ? 
                              (Array.isArray(responses[question.id]) ? responses[question.id] : [responses[question.id]]) : 
                              [];
                            let newResponses;
                            if (e.target.checked) {
                              newResponses = [...currentResponses, option];
                            } else {
                              newResponses = currentResponses.filter(r => r !== option);
                            }
                            handleResponseChange(question.id, newResponses);
                          }}
                          style={{ marginRight: '12px' }}
                        />
                        {option}
                      </label>
                    ))}
                  </Box>
                )}
              </Box>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  backgroundColor: '#8B1EDE',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
              >
                Submit Survey
              </button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default SurveyFill; 