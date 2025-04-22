import axios from 'axios';

export const fetchUserSurveys = async () => {
    try {
        console.log('Fetching user surveys...');
        const response = await axios.get('/survey/user-surveys');
        console.log('Surveys response:', response.data);
        return response.data.surveys;
    } catch (error) {
        console.error('Error fetching surveys:', error);
        throw error;
    }
};

export const fetchSurveyById = async (id) => {
    try {
        console.log('Fetching survey with ID:', id);
        const response = await fetch(`/survey/get/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server error:', errorData);
            throw new Error(errorData.error || 'Failed to fetch survey');
        }

        const data = await response.json();
        console.log('Survey data received:', data);
        return data;
    } catch (error) {
        console.error('Error fetching survey:', error);
        throw error;
    }
};

export const updateSurvey = async (surveyId, surveyData) => {
    try {
        console.log(`Updating survey ${surveyId} with data:`, surveyData);
        const response = await fetch(`/survey/${surveyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(surveyData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update survey');
        }

        const data = await response.json();
        console.log('Survey updated successfully:', data);
        return data.survey;
    } catch (error) {
        console.error('Error updating survey:', error);
        throw error;
    }
};

export const toggleSurveyStatus = async (surveyId, isActive) => {
    try {
        const response = await fetch(`/survey/toggle-status/${surveyId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ is_active: isActive })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to toggle survey status');
        }

        const data = await response.json();
        console.log('Survey status updated:', data);
        return data;
    } catch (error) {
        console.error('Error toggling survey status:', error);
        throw error;
    }
}; 