import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Comments from './Comments';
import './../../CSS/LearningPlanDetail.css';

const LearningPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [learningPlan, setLearningPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Simulating a logged-in user - in a real app, get this from auth context/redux
  const currentUserId = 1; // Replace with actual logged-in user ID

  useEffect(() => {
    const fetchLearningPlan = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/learning-plans/${id}`);
        setLearningPlan(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching learning plan:', err);
        setError('Failed to load learning plan. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPlan();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleGoBack = () => {
    navigate('/learning-plans');
  };

  if (isLoading) {
    return <div className="loading-container">Loading learning plan details...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!learningPlan) {
    return <div className="error-container">Learning plan not found.</div>;
  }

  return (
    <div className="learning-plan-detail">
      <button className="back-button" onClick={handleGoBack}>← Back to Learning Plans</button>
      
      <div className="plan-header">
        <h1>{learningPlan.title}</h1>
        <div className="plan-status" data-status={learningPlan.status.toLowerCase()}>
          {learningPlan.status.replace('_', ' ')}
        </div>
      </div>
      
      <div className="plan-meta">
        <div className="plan-dates">
          <span>Start: {formatDate(learningPlan.startDate)}</span>
          <span>End: {formatDate(learningPlan.endDate)}</span>
        </div>
        <div className="plan-progress">
          <div className="progress-label">Progress: {learningPlan.progressPercentage}%</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{width: `${learningPlan.progressPercentage}%`}}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="plan-description">
        <h3>Description</h3>
        <p>{learningPlan.description}</p>
      </div>
      
      {learningPlan.topics && learningPlan.topics.length > 0 && (
        <div className="plan-topics">
          <h3>Topics</h3>
          <ul>
            {learningPlan.topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>
      )}
      
      {learningPlan.resources && learningPlan.resources.length > 0 && (
        <div className="plan-resources">
          <h3>Resources</h3>
          <ul>
            {learningPlan.resources.map((resource, index) => (
              <li key={index}>{resource}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Comments section */}
      <Comments learningPlanId={id} userId={currentUserId} />
    </div>
  );
};

export default LearningPlanDetail;