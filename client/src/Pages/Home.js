import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import '../css/HomePage.css';

export default function Home() {
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLearningPlans();
  }, []);

  const loadLearningPlans = async () => {
    setLoading(true);
    try {
      const result = await axios.get("http://localhost:8080/api/learning-plans");
      setLearningPlans(result.data);
    } catch (error) {
      console.error("Error loading learning plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLearningPlan = async (id) => {
    if (window.confirm("Are you sure you want to delete this learning plan?")) {
      try {
        await axios.delete(`http://localhost:8080/api/learning-plan/${id}`);
        loadLearningPlans(); // Reload the list after deletion
      } catch (error) {
        console.error("Error deleting learning plan:", error);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'NOT_STARTED': 
        return "homepage-badge homepage-badge-secondary";
      case 'IN_PROGRESS': 
        return "homepage-badge homepage-badge-primary";
      case 'COMPLETED': 
        return "homepage-badge homepage-badge-success";
      default: 
        return "homepage-badge homepage-badge-light";
    }
  };

  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <h2 className="homepage-title">Learning Plans</h2>
        <Link to="/add-learning-plan" className="homepage-btn homepage-btn-primary">
          <span className="homepage-btn-icon">+</span> Add Learning Plan
        </Link>
      </div>

      {loading ? (
        <div className="homepage-loading">
          <div className="homepage-spinner"></div>
          <span>Loading your learning journey...</span>
        </div>
      ) : learningPlans.length === 0 ? (
        <div className="homepage-empty-state">
          <div className="homepage-empty-icon">📚</div>
          <h3>No learning plans found</h3>
          <p>Start your learning journey by creating your first plan!</p>
          <Link to="/add-learning-plan" className="homepage-btn homepage-btn-primary">
            Create Learning Plan
          </Link>
        </div>
      ) : (
        <div className="homepage-grid">
          {learningPlans.map((plan) => (
            <div className="homepage-card" key={plan.id}>
              <div className="homepage-card-header">
                <h3 className="homepage-card-title">{plan.title}</h3>
                <span className={getStatusBadgeClass(plan.status)}>
                  {plan.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="homepage-card-dates">
                <span className="homepage-date-icon">🗓️</span>
                {format(new Date(plan.startDate), 'MMM d, yyyy')} - {format(new Date(plan.endDate), 'MMM d, yyyy')}
              </div>
              
              <div className="homepage-card-description">
                {plan.description.length > 100 
                  ? `${plan.description.substring(0, 100)}...` 
                  : plan.description}
              </div>
              
              <div className="homepage-progress-container">
                <div className="homepage-progress-info">
                  <span>Progress</span>
                  <span className="homepage-progress-percentage">{plan.progressPercentage}%</span>
                </div>
                <div className="homepage-progress-bar">
                  <div 
                    className="homepage-progress-fill" 
                    style={{ width: `${plan.progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              {plan.topics && plan.topics.length > 0 && (
                <div className="homepage-topics">
                  <span className="homepage-topics-label">Topics:</span>
                  <div className="homepage-topics-container">
                    {plan.topics.map((topic, index) => (
                      <span key={index} className="homepage-topic-tag">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="homepage-card-actions">
                <Link to={`/view-learning-plan/${plan.id}`} className="homepage-btn homepage-btn-view">
                  View Plan
                </Link>
                <div className="homepage-btn-group">
                  <Link to={`/edit-learning-plan/${plan.id}`} className="homepage-btn homepage-btn-edit">
                    Edit
                  </Link>
                  <button 
                    onClick={() => deleteLearningPlan(plan.id)} 
                    className="homepage-btn homepage-btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}