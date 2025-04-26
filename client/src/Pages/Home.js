import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import '../css/HomePage.css';
import NavBar from '../components/NavBar';

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

  const filteredPlans = learningPlans
    .filter(plan => plan.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   plan.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(plan => filterStatus === 'ALL' ? true : plan.status === filterStatus);

  return (
    <>
      <NavBar />
      <div className="homepage-hero">
        <div className="homepage-hero-content">
          <h1>Welcome to SkillTribe</h1>
          <p>Track your learning journey and achieve your goals</p>
        </div>
      </div>
      
      <div className="homepage-container">
        <div className="homepage-filters">
          <div className="homepage-search">
            <input 
              type="text" 
              placeholder="Search learning plans..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="homepage-search-input"
            />
            <span className="homepage-search-icon">🔍</span>
          </div>
          
          <div className="homepage-filter-status">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="homepage-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
        
        <div className="homepage-header">
          <div className="homepage-title-section">
            <h2 className="homepage-title">My Learning Plans</h2>
            <p className="homepage-subtitle">Organize and track your educational journey</p>
          </div>
          <Link to="/add-learning-plan" className="homepage-btn homepage-btn-primary">
            <span className="homepage-btn-icon">+</span> Create New Plan
          </Link>
        </div>

        {loading ? (
          <div className="homepage-loading">
            <div className="homepage-spinner"></div>
            <span>Loading your learning journey...</span>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="homepage-empty-state">
            <div className="homepage-empty-icon">📚</div>
            <h3>No learning plans found</h3>
            <p>{searchTerm || filterStatus !== 'ALL' ? 
              "Try adjusting your search or filters" : 
              "Start your learning journey by creating your first plan!"}
            </p>
            {!searchTerm && filterStatus === 'ALL' && (
              <Link to="/add-learning-plan" className="homepage-btn homepage-btn-primary">
                Create Learning Plan
              </Link>
            )}
          </div>
        ) : (
          <div className="homepage-dashboard">
            <div className="homepage-stats">
              <div className="homepage-stat-card">
                <div className="homepage-stat-value">{learningPlans.length}</div>
                <div className="homepage-stat-label">Total Plans</div>
              </div>
              <div className="homepage-stat-card">
                <div className="homepage-stat-value">
                  {learningPlans.filter(plan => plan.status === 'IN_PROGRESS').length}
                </div>
                <div className="homepage-stat-label">In Progress</div>
              </div>
              <div className="homepage-stat-card">
                <div className="homepage-stat-value">
                  {learningPlans.filter(plan => plan.status === 'COMPLETED').length}
                </div>
                <div className="homepage-stat-label">Completed</div>
              </div>
            </div>
            
            <h3 className="homepage-section-title">Your Learning Plans</h3>
            
            <div className="homepage-grid">
              {filteredPlans.map((plan) => (
                <div className="homepage-card" key={plan.id}>
                  <div className="homepage-card-header">
                    <h3 className="homepage-card-title">{plan.title}</h3>
                    <span className={getStatusBadgeClass(plan.status)}>
                      {plan.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="homepage-card-dates">
                    <span className="homepage-date-icon">🗓️</span>
                    <span className="homepage-date-text">
                      {format(new Date(plan.startDate), 'MMM d, yyyy')} - {format(new Date(plan.endDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  <div className="homepage-card-description">
                    {plan.description.length > 120 
                      ? `${plan.description.substring(0, 120)}...` 
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
                      <div className="homepage-topics-container">
                        {plan.topics.slice(0, 3).map((topic, index) => (
                          <span key={index} className="homepage-topic-tag">
                            {topic}
                          </span>
                        ))}
                        {plan.topics.length > 3 && (
                          <span className="homepage-topic-more">+{plan.topics.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="homepage-card-actions">
                    <Link to={`/view-learning-plan/${plan.id}`} className="homepage-btn homepage-btn-view">
                      View Details
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
          </div>
        )}
      </div>
    </>
  );
}