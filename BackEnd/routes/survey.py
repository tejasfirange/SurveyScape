from flask import Blueprint, request, jsonify, session
from models.user import User
from models import db
import logging
from datetime import datetime
from sqlalchemy.orm.attributes import flag_modified
from models.survey import Survey, Question

survey = Blueprint('survey', __name__)
logger = logging.getLogger(__name__)

@survey.route('/create', methods=['POST'])
def create_survey():
    try:
        # Check if user is authenticated
        user_id = session.get('user_id')
        if not user_id:
            logger.error("Unauthorized attempt to create survey")
            return jsonify({'error': 'Unauthorized'}), 401

        user = User.query.get(user_id)
        if not user:
            logger.error(f"User not found for ID: {user_id}")
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()
        logger.info(f"Received survey data: {data}")
        
        if not data:
            logger.error("No data provided")
            return jsonify({'error': 'No data provided'}), 400

        logger.info(f"Survey creation attempt by user: {user.email}")
        logger.info(f"Current surveys_generated before update: {user.surveys_generated}")

        # Validate required fields
        required_fields = ['title', 'description', 'questions']
        if not all(field in data for field in required_fields):
            logger.error("Missing required fields in survey creation")
            return jsonify({'error': 'Missing required fields'}), 400

        # Create survey object
        survey_data = {
            'id': str(datetime.utcnow().timestamp()),
            'title': data['title'],
            'description': data['description'],
            'questions': data['questions'],
            'created_at': datetime.utcnow().isoformat(),
            'responses': []
        }

        # Ensure surveys_generated is properly initialized
        if user.surveys_generated is None:
            user.surveys_generated = {"surveys": {}}
        elif not isinstance(user.surveys_generated, dict):
            user.surveys_generated = {"surveys": {}}
        elif "surveys" not in user.surveys_generated:
            user.surveys_generated["surveys"] = {}

        # Add the new survey
        user.surveys_generated["surveys"][survey_data['id']] = survey_data
        logger.info(f"Updated surveys_generated structure: {user.surveys_generated}")

        # Explicitly mark the field as modified
        flag_modified(user, 'surveys_generated')
        
        try:
            db.session.add(user)
            db.session.commit()
            logger.info(f"Survey created successfully by user: {user.email}")
            logger.info(f"Final surveys_generated state: {user.surveys_generated}")
            
            # Verify the save
            db.session.refresh(user)
            logger.info(f"Verified saved state: {user.surveys_generated}")
            
            return jsonify({
                'message': 'Survey created successfully',
                'survey': survey_data
            }), 201
        except Exception as e:
            db.session.rollback()
            logger.error(f"Database error while creating survey: {str(e)}")
            return jsonify({'error': 'Database error'}), 500

    except Exception as e:
        logger.error(f"Error creating survey: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@survey.route('/user-surveys', methods=['GET'])
def get_user_surveys():
    try:
        # Check if user is authenticated
        user_id = session.get('user_id')
        if not user_id:
            logger.error("Unauthorized attempt to fetch surveys")
            return jsonify({'error': 'Unauthorized'}), 401

        user = User.query.get(user_id)
        if not user:
            logger.error(f"User not found for ID: {user_id}")
            return jsonify({'error': 'User not found'}), 404

        logger.info(f"Fetching surveys for user: {user.email}")
        logger.info(f"Raw surveys_generated data: {user.surveys_generated}")

        # Get surveys from user's surveys_generated
        if not user.surveys_generated:
            logger.info("No surveys_generated data found, initializing empty")
            surveys = {}
        else:
            surveys = user.surveys_generated.get('surveys', {})
            logger.info(f"Found surveys data: {surveys}")
        
        # Convert the surveys dictionary to a list and sort by created_at
        survey_list = [
            {
                'id': survey_id,
                **survey_data
            }
            for survey_id, survey_data in surveys.items()
        ]
        survey_list.sort(key=lambda x: x['created_at'], reverse=True)

        logger.info(f"Returning {len(survey_list)} surveys: {survey_list}")
        return jsonify({
            'surveys': survey_list
        }), 200

    except Exception as e:
        logger.error(f"Error fetching surveys: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@survey.route('/get/<survey_id>', methods=['GET'])
def get_survey(survey_id):
    try:
        logger.info(f"Fetching survey with ID: {survey_id}")
        
        # Try to find the survey in the user's surveys_generated
        user_id = session.get('user_id')
        if not user_id:
            logger.error("Unauthorized attempt to fetch survey")
            return jsonify({'error': 'Unauthorized'}), 401

        user = User.query.get(user_id)
        if not user or not user.surveys_generated:
            logger.error(f"User not found or no surveys for user: {user_id}")
            return jsonify({'error': 'Survey not found'}), 404

        surveys = user.surveys_generated.get('surveys', {})
        survey_data = surveys.get(str(survey_id))
        
        if not survey_data:
            logger.error(f"Survey not found with ID: {survey_id}")
            return jsonify({'error': 'Survey not found'}), 404

        logger.info(f"Successfully fetched survey: {survey_data}")
        return jsonify(survey_data)

    except Exception as e:
        logger.error(f"Error fetching survey: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@survey.route('/<survey_id>', methods=['PUT'])
def update_survey(survey_id):
    try:
        # Check if user is authenticated
        user_id = session.get('user_id')
        if not user_id:
            logger.error("Unauthorized attempt to update survey")
            return jsonify({'error': 'Unauthorized'}), 401

        user = User.query.get(user_id)
        if not user:
            logger.error(f"User not found for ID: {user_id}")
            return jsonify({'error': 'User not found'}), 404

        # Get the survey from user's surveys_generated
        if not user.surveys_generated or 'surveys' not in user.surveys_generated:
            logger.error(f"No surveys found for user: {user_id}")
            return jsonify({'error': 'Survey not found'}), 404

        surveys = user.surveys_generated['surveys']
        if str(survey_id) not in surveys:
            logger.error(f"Survey not found with ID: {survey_id}")
            return jsonify({'error': 'Survey not found'}), 404

        data = request.get_json()
        logger.info(f"Received update data for survey {survey_id}: {data}")

        # Update survey data
        survey_data = surveys[str(survey_id)]
        survey_data.update({
            'title': data.get('title', survey_data['title']),
            'description': data.get('description', survey_data['description']),
            'questions': data.get('questions', survey_data['questions'])
        })

        # Mark the field as modified since we're updating a JSON field
        flag_modified(user, 'surveys_generated')

        try:
            db.session.commit()
            logger.info(f"Survey {survey_id} updated successfully")
            return jsonify({
                'message': 'Survey updated successfully',
                'survey': survey_data
            }), 200
        except Exception as e:
            db.session.rollback()
            logger.error(f"Database error while updating survey: {str(e)}")
            return jsonify({'error': 'Database error'}), 500

    except Exception as e:
        logger.error(f"Error updating survey: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@survey.route('/toggle-status/<survey_id>', methods=['POST'])
def toggle_survey_status(survey_id):
    try:
        # Check if user is authenticated
        user_id = session.get('user_id')
        if not user_id:
            logger.error("Unauthorized attempt to toggle survey status")
            return jsonify({'error': 'Unauthorized'}), 401

        user = User.query.get(user_id)
        if not user or not user.surveys_generated:
            logger.error(f"User not found or no surveys for user: {user_id}")
            return jsonify({'error': 'Survey not found'}), 404

        surveys = user.surveys_generated.get('surveys', {})
        survey_data = surveys.get(str(survey_id))
        
        if not survey_data:
            logger.error(f"Survey not found with ID: {survey_id}")
            return jsonify({'error': 'Survey not found'}), 404

        # Get the new status from request body
        data = request.get_json()
        new_status = data.get('is_active', False)

        # Update the survey status
        survey_data['is_active'] = new_status
        flag_modified(user, 'surveys_generated')
        db.session.commit()

        logger.info(f"Survey {survey_id} status updated to: {new_status}")
        return jsonify({
            'message': 'Survey status updated successfully',
            'survey_id': survey_id,
            'is_active': new_status
        })

    except Exception as e:
        logger.error(f"Error toggling survey status: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@survey.route('/delete/<survey_id>', methods=['DELETE'])
def delete_survey(survey_id):
    try:
        # Check if user is authenticated
        user_id = session.get('user_id')
        if not user_id:
            logger.error("Unauthorized attempt to delete survey")
            return jsonify({'error': 'Unauthorized'}), 401

        user = User.query.get(user_id)
        if not user or not user.surveys_generated:
            logger.error(f"User not found or no surveys for user: {user_id}")
            return jsonify({'error': 'Survey not found'}), 404

        surveys = user.surveys_generated.get('surveys', {})
        if str(survey_id) not in surveys:
            logger.error(f"Survey not found with ID: {survey_id}")
            return jsonify({'error': 'Survey not found'}), 404

        # Delete the survey
        del user.surveys_generated['surveys'][str(survey_id)]
        flag_modified(user, 'surveys_generated')
        db.session.commit()

        logger.info(f"Survey {survey_id} deleted successfully")
        return jsonify({
            'message': 'Survey deleted successfully',
            'survey_id': survey_id
        })

    except Exception as e:
        logger.error(f"Error deleting survey: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500 