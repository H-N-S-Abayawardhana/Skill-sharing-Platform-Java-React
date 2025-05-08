import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import '../../css/ViewLearningPlan.css';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

export default function Home() {
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    loadLearningPlans();
  }, []);

  const loadLearningPlans = async () => {
    setLoading(true);
    try {
      const result = await axios.get("http://localhost:8080/api/learning-plans");
      setLearningPlans(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Error loading learning plans:", error);
      setLearningPlans([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const deleteLearningPlan = async (id) => {
    if (window.confirm("Are you sure you want to delete this learning plan?")) {
      try {
        await axios.delete(`http://localhost:8080/api/learning-plan/${id}`);
        loadLearningPlans(); 
      } catch (error) {
        console.error("Error deleting learning plan:", error);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'NOT_STARTED': 
        return "user-viewlearningplans-badge user-viewlearningplans-badge-secondary";
      case 'IN_PROGRESS': 
        return "user-viewlearningplans-badge user-viewlearningplans-badge-primary";
      case 'COMPLETED': 
        return "user-viewlearningplans-badge user-viewlearningplans-badge-success";
      default: 
        return "user-viewlearningplans-badge user-viewlearningplans-badge-light";
    }
  };

  const filteredPlans = Array.isArray(learningPlans) 
    ? learningPlans
        .filter(plan => plan.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       plan.description.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(plan => filterStatus === 'ALL' ? true : plan.status === filterStatus)
    : [];

  return (
    <>
      <NavBar />
      
      
      <div className="user-viewlearningplans-container">
        <div className="user-viewlearningplans-filters">
          <div className="user-viewlearningplans-search">
            <input 
              type="text" 
              placeholder="Search learning plans..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="user-viewlearningplans-search-input"
            />
            <span className="user-viewlearningplans-search-icon">🔍</span>
          </div>
          
          <div className="user-viewlearningplans-filter-status">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="user-viewlearningplans-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
        
        <div className="user-viewlearningplans-header">
          <div className="user-viewlearningplans-title-section">
            <h2 className="user-viewlearningplans-title">My Learning Plans</h2>
            <p className="user-viewlearningplans-subtitle">Organize and track your educational journey</p>
          </div>
          <Link to="/add-learning-plan" className="user-viewlearningplans-btn user-viewlearningplans-btn-primary">
            <span className="user-viewlearningplans-btn-icon">+</span> Create New Plan
          </Link>
        </div>

        {loading ? (
          <div className="user-viewlearningplans-loading">
            <div className="user-viewlearningplans-spinner"></div>
            <span>Loading your learning journey...</span>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="user-viewlearningplans-empty-state">
            <div className="user-viewlearningplans-empty-icon">📚</div>
            <h3>No learning plans found</h3>
            <p>{searchTerm || filterStatus !== 'ALL' ? 
              "Try adjusting your search or filters" : 
              "Start your learning journey by creating your first plan!"}
            </p>
            {!searchTerm && filterStatus === 'ALL' && (
              <Link to="/add-learning-plan" className="user-viewlearningplans-btn user-viewlearningplans-btn-primary">
                Create Learning Plan
              </Link>
            )}
          </div>
        ) : (
          <div className="user-viewlearningplans-dashboard">
            <div className="user-viewlearningplans-stats">
              <div className="user-viewlearningplans-stat-card">
                <div className="user-viewlearningplans-stat-value">{learningPlans.length}</div>
                <div className="user-viewlearningplans-stat-label">Total Plans</div>
              </div>
              <div className="user-viewlearningplans-stat-card">
                <div className="user-viewlearningplans-stat-value">
                  {learningPlans.filter(plan => plan.status === 'IN_PROGRESS').length}
                </div>
                <div className="user-viewlearningplans-stat-label">In Progress</div>
              </div>
              <div className="user-viewlearningplans-stat-card">
                <div className="user-viewlearningplans-stat-value">
                  {learningPlans.filter(plan => plan.status === 'COMPLETED').length}
                </div>
                <div className="user-viewlearningplans-stat-label">Completed</div>
              </div>
            </div>
            
            <h3 className="user-viewlearningplans-section-title">Your Learning Plans</h3>
            
            <div className="user-viewlearningplans-grid">
              {filteredPlans.map((plan) => (
                <div className="user-viewlearningplans-card" key={plan.id}>
                  <div className="user-viewlearningplans-card-header">
                    <h3 className="user-viewlearningplans-card-title">{plan.title}</h3>
                    <span className={getStatusBadgeClass(plan.status)}>
                      {plan.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="user-viewlearningplans-card-dates">
                    <span className="user-viewlearningplans-date-icon">🗓️</span>
                    <span className="user-viewlearningplans-date-text">
                      {format(new Date(plan.startDate), 'MMM d, yyyy')} - {format(new Date(plan.endDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  <div className="user-viewlearningplans-card-description">
                    {plan.description.length > 120 
                      ? `${plan.description.substring(0, 120)}...` 
                      : plan.description}
                  </div>
                  
                  <div className="user-viewlearningplans-progress-container">
                    <div className="user-viewlearningplans-progress-info">
                      <span>Progress</span>
                      <span className="user-viewlearningplans-progress-percentage">{plan.progressPercentage}%</span>
                    </div>
                    <div className="user-viewlearningplans-progress-bar">
                      <div 
                        className="user-viewlearningplans-progress-fill" 
                        style={{ width: `${plan.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {plan.topics && plan.topics.length > 0 && (
                    <div className="user-viewlearningplans-topics">
                      <div className="user-viewlearningplans-topics-container">
                        {plan.topics.slice(0, 3).map((topic, index) => (
                          <span key={index} className="user-viewlearningplans-topic-tag">
                            {topic}
                          </span>
                        ))}
                        {plan.topics.length > 3 && (
                          <span className="user-viewlearningplans-topic-more">+{plan.topics.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="user-viewlearningplans-card-actions">
                    <Link to={`/view-learning-plan/${plan.id}`} className="user-viewlearningplans-btn user-viewlearningplans-btn-view">
                      View Details
                    </Link>
                    <div className="user-viewlearningplans-btn-group">
                      <Link to={`/edit-learning-plan/${plan.id}`} className="user-viewlearningplans-btn user-viewlearningplans-btn-edit">
                        Edit
                      </Link>
                      <button 
                        onClick={() => deleteLearningPlan(plan.id)} 
                        className="user-viewlearningplans-btn user-viewlearningplans-btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}