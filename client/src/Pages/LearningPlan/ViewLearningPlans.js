import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import '../../css/ViewLearningPlans.css';
import NavBar from '../../components/NavBar';

export default function ViewLearningPlans() {
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
        return "view-learning-plans-badge view-learning-plans-badge-secondary";
      case 'IN_PROGRESS': 
        return "view-learning-plans-badge view-learning-plans-badge-primary";
      case 'COMPLETED': 
        return "view-learning-plans-badge view-learning-plans-badge-success";
      default: 
        return "view-learning-plans-badge view-learning-plans-badge-light";
    }
  };

  const getFormattedStatus = (status) => {
    return status.replace('_', ' ');
  };

  const filteredPlans = learningPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (plan.topics && plan.topics.some(topic => 
                            topic.toLowerCase().includes(searchTerm.toLowerCase())
                         ));
    
    const matchesFilter = filterStatus === 'ALL' || plan.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <NavBar />
      <div className="view-learning-plans-container">
        <div className="view-learning-plans-header">
          <div className="view-learning-plans-title-section">
            <h1 className="view-learning-plans-title">Learning Plans</h1>
            <p className="view-learning-plans-subtitle">
              Track and manage your learning journey
            </p>
          </div>
          <Link to="/add-learning-plan" className="view-learning-plans-btn view-learning-plans-btn-primary">
            <span className="view-learning-plans-btn-icon">+</span> Create New Plan
          </Link>
        </div>

        <div className="view-learning-plans-filters">
          <div className="view-learning-plans-search">
            <input
              type="text"
              placeholder="Search plans by title, description or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="view-learning-plans-search-input"
            />
            <span className="view-learning-plans-search-icon">🔍</span>
          </div>
          
          <div className="view-learning-plans-filter-group">
            <label className="view-learning-plans-filter-label">Filter by status:</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="view-learning-plans-filter-select"
            >
              <option value="ALL">All Plans</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="view-learning-plans-loading">
            <div className="view-learning-plans-spinner"></div>
            <span>Loading your learning plans...</span>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="view-learning-plans-empty-state">
            <div className="view-learning-plans-empty-icon">📚</div>
            {searchTerm || filterStatus !== 'ALL' ? (
              <>
                <h3>No matching learning plans found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('ALL');
                  }} 
                  className="view-learning-plans-btn view-learning-plans-btn-secondary"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <h3>No learning plans found</h3>
                <p>Start your learning journey by creating your first plan!</p>
                <Link to="/add-learning-plan" className="view-learning-plans-btn view-learning-plans-btn-primary">
                  Create Learning Plan
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="view-learning-plans-count">
              Showing {filteredPlans.length} {filteredPlans.length === 1 ? 'plan' : 'plans'}
              {(searchTerm || filterStatus !== 'ALL') && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('ALL');
                  }}
                  className="view-learning-plans-clear-btn"
                >
                  Clear Filters
                </button>
              )}
            </div>
            <div className="view-learning-plans-grid">
              {filteredPlans.map((plan) => (
                <div className="view-learning-plans-card" key={plan.id}>
                  <div className="view-learning-plans-card-header">
                    <h3 className="view-learning-plans-card-title">{plan.title}</h3>
                    <span className={getStatusBadgeClass(plan.status)}>
                      {getFormattedStatus(plan.status)}
                    </span>
                  </div>
                  
                  <div className="view-learning-plans-card-dates">
                    <span className="view-learning-plans-date-icon">🗓️</span>
                    {format(new Date(plan.startDate), 'MMM d, yyyy')} - {format(new Date(plan.endDate), 'MMM d, yyyy')}
                  </div>
                  
                  <div className="view-learning-plans-card-description">
                    {plan.description.length > 100 
                      ? `${plan.description.substring(0, 100)}...` 
                      : plan.description}
                  </div>
                  
                  <div className="view-learning-plans-progress-container">
                    <div className="view-learning-plans-progress-info">
                      <span>Progress</span>
                      <span className="view-learning-plans-progress-percentage">{plan.progressPercentage}%</span>
                    </div>
                    <div className="view-learning-plans-progress-bar">
                      <div 
                        className="view-learning-plans-progress-fill" 
                        style={{ width: `${plan.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {plan.topics && plan.topics.length > 0 && (
                    <div className="view-learning-plans-topics">
                      <span className="view-learning-plans-topics-label">Topics:</span>
                      <div className="view-learning-plans-topics-container">
                        {plan.topics.slice(0, 3).map((topic, index) => (
                          <span key={index} className="view-learning-plans-topic-tag">
                            {topic}
                          </span>
                        ))}
                        {plan.topics.length > 3 && (
                          <span className="view-learning-plans-topic-more">
                            +{plan.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="view-learning-plans-card-actions">
                    <Link to={`/view-learning-plan/${plan.id}`} className="view-learning-plans-btn view-learning-plans-btn-view">
                      View Details
                    </Link>
                    <div className="view-learning-plans-btn-group">
                      <Link to={`/edit-learning-plan/${plan.id}`} className="view-learning-plans-btn view-learning-plans-btn-edit">
                        Edit
                      </Link>
                      <button 
                        onClick={() => deleteLearningPlan(plan.id)} 
                        className="view-learning-plans-btn view-learning-plans-btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}