import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/CreateSurvey.css';

const CreateSurvey = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [survey, setSurvey] = useState({
        title: '',
        description: '',
        questions: [{
            text: '',
            type: 'text',
            options: []
        }]
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleAddQuestion = () => {
        setSurvey(prev => ({
            ...prev,
            questions: [...prev.questions, {
                text: '',
                type: 'text',
                options: []
            }]
        }));
    };

    const handleRemoveQuestion = (index) => {
        setSurvey(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const handleQuestionChange = (index, field, value) => {
        setSurvey(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) => 
                i === index ? { ...q, [field]: value } : q
            )
        }));
    };

    const handleAddOption = (questionIndex) => {
        setSurvey(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) => 
                i === questionIndex ? { ...q, options: [...q.options, ''] } : q
            )
        }));
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        setSurvey(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) => 
                i === questionIndex ? {
                    ...q,
                    options: q.options.map((opt, j) => j === optionIndex ? value : opt)
                } : q
            )
        }));
    };

    const handleRemoveOption = (questionIndex, optionIndex) => {
        setSurvey(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) => 
                i === questionIndex ? {
                    ...q,
                    options: q.options.filter((_, j) => j !== optionIndex)
                } : q
            )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate survey data
            if (!survey.title.trim()) {
                setError('Survey title is required');
                return;
            }
            if (!survey.description.trim()) {
                setError('Survey description is required');
                return;
            }
            if (!survey.questions.length) {
                setError('At least one question is required');
                return;
            }
            
            // Validate questions
            for (let q of survey.questions) {
                if (!q.text.trim()) {
                    setError('All questions must have text');
                    return;
                }
                if ((q.type === 'multiple-choice' || q.type === 'single-choice') && (!q.options || q.options.length < 2)) {
                    setError('Choice questions must have at least 2 options');
                    return;
                }
            }

            console.log('All validations passed, preparing to send data');
            console.log('Sending survey data:', JSON.stringify(survey, null, 2));

            const apiUrl = 'http://localhost:5000/survey/create';
            console.log('Sending request to:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(survey),
                credentials: 'include'
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create survey');
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            console.error('Error creating survey:', err);
            setError(err.message || 'Failed to create survey');
        }
    };

    return (
        <div className="create-survey">
            <nav className="navbar">
                <div className="nav-brand">SurveyScape</div>
                <div className="nav-right">
                    <span className="user-email">{user?.email}</span>
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>
            </nav>

            <main className="create-survey-content">
                <div className="create-survey-header">
                    <h1>Create New Survey</h1>
                </div>

                <form onSubmit={handleSubmit} className="survey-form">
                    <div className="form-group">
                        <label htmlFor="title">Survey Title</label>
                        <input
                            type="text"
                            id="title"
                            value={survey.title}
                            onChange={(e) => setSurvey(prev => ({ ...prev, title: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Survey Description</label>
                        <textarea
                            id="description"
                            value={survey.description}
                            onChange={(e) => setSurvey(prev => ({ ...prev, description: e.target.value }))}
                            required
                        />
                    </div>

                    {survey.questions.map((question, qIndex) => (
                        <div key={qIndex} className="question-card">
                            <div className="question-header">
                                <h3>Question {qIndex + 1}</h3>
                                <button 
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => handleRemoveQuestion(qIndex)}
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="form-group">
                                <label htmlFor={`question-${qIndex}`}>Question Text</label>
                                <input
                                    type="text"
                                    id={`question-${qIndex}`}
                                    value={question.text}
                                    onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor={`type-${qIndex}`}>Question Type</label>
                                <select
                                    id={`type-${qIndex}`}
                                    value={question.type}
                                    onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                                >
                                    <option value="text">Text</option>
                                    <option value="multiple-choice">Multiple Choice</option>
                                    <option value="single-choice">Single Choice</option>
                                </select>
                            </div>

                            {(question.type === 'multiple-choice' || question.type === 'single-choice') && (
                                <div className="options-group">
                                    <h4>Options</h4>
                                    {question.options.map((option, oIndex) => (
                                        <div key={oIndex} className="option-item">
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => handleRemoveOption(qIndex, oIndex)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="add-btn"
                                        onClick={() => handleAddOption(qIndex)}
                                    >
                                        Add Option
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        className="add-btn"
                        onClick={handleAddQuestion}
                    >
                        Add Question
                    </button>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            Create Survey
                        </button>
                    </div>
                </form>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Survey created successfully!</div>}
            </main>
        </div>
    );
};

export default CreateSurvey; 