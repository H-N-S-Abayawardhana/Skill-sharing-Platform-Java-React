import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import '../../css/ViewLearningPlan.css';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

export default function Home() {
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('startDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');

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

  const confirmDeleteLearningPlan = (id, title) => {
    Swal.fire({
      title: 'Delete Learning Plan?',
      html: `Are you sure you want to delete <strong>${title}</strong>?<br>This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--danger-color)',
      cancelButtonColor: 'var(--text-secondary)',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      background: 'var(--card-background)',
      color: 'var(--text-color)',
      borderRadius: 'var(--border-radius)',
      focusConfirm: false,
      reverseButtons: true,
      customClass: {
        container: 'user-viewlearningplans-swal-container',
        popup: 'user-viewlearningplans-swal-popup',
        title: 'user-viewlearningplans-swal-title',
        htmlContainer: 'user-viewlearningplans-swal-content',
        confirmButton: 'user-viewlearningplans-swal-confirm',
        cancelButton: 'user-viewlearningplans-swal-cancel'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLearningPlan(id);
      }
    });
  };

  const deleteLearningPlan = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/learning-plan/${id}`);
      
      Swal.fire({
        title: 'Deleted!',
        text: 'Learning plan has been deleted successfully.',
        icon: 'success',
        confirmButtonColor: 'var(--primary-color)',
        background: 'var(--card-background)',
        color: 'var(--text-color)',
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          popup: 'user-viewlearningplans-swal-popup',
          title: 'user-viewlearningplans-swal-title'
        }
      });
      
      loadLearningPlans();
    } catch (error) {
      console.error("Error deleting learning plan:", error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to delete the learning plan. Please try again.',
        icon: 'error',
        confirmButtonColor: 'var(--primary-color)',
        background: 'var(--card-background)',
        color: 'var(--text-color)',
        customClass: {
          popup: 'user-viewlearningplans-swal-popup',
          title: 'user-viewlearningplans-swal-title'
        }
      });
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

  const handleSortChange = (value) => {
    if (sortBy === value) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value);
      setSortOrder('asc');
    }
  };

  const getDueStatus = (endDate) => {
    const now = new Date();
    const due = new Date(endDate);
    const diffDays = Math.round((due - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "user-viewlearningplans-overdue";
    if (diffDays <= 7) return "user-viewlearningplans-due-soon";
    return "";
  };

  const filteredPlans = Array.isArray(learningPlans) 
    ? learningPlans
        .filter(plan => 
          plan.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (plan.topics && plan.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase())))
        )
        .filter(plan => filterStatus === 'ALL' ? true : plan.status === filterStatus)
        .sort((a, b) => {
          if (sortBy === 'title') {
            return sortOrder === 'asc' 
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title);
          } else if (sortBy === 'progress') {
            return sortOrder === 'asc'
              ? a.progressPercentage - b.progressPercentage
              : b.progressPercentage - a.progressPercentage;
          } else if (sortBy === 'startDate') {
            return sortOrder === 'asc'
              ? new Date(a.startDate) - new Date(b.startDate)
              : new Date(b.startDate) - new Date(a.startDate);
          } else if (sortBy === 'endDate') {
            return sortOrder === 'asc'
              ? new Date(a.endDate) - new Date(b.endDate)
              : new Date(b.endDate) - new Date(a.endDate);
          }
          return 0;
        })
    : [];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('ALL');
    setSortBy('startDate');
    setSortOrder('desc');
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const renderPlanCard = (plan) => (
    <div className={`user-viewlearningplans-card ${getDueStatus(plan.endDate)}`} key={plan.id}>
      <div className="user-viewlearningplans-card-header">
        <h3 className="user-viewlearningplans-card-title">{plan.title}</h3>
        <span className={getStatusBadgeClass(plan.status)}>
          {plan.status.replace('_', ' ')}
        </span>
      </div>
      
      <div className="user-viewlearningplans-card-dates">
        <div className="user-viewlearningplans-date-item">
          <span className="user-viewlearningplans-date-icon">🏁</span>
          <span className="user-viewlearningplans-date-label">Start:</span>
          <span className="user-viewlearningplans-date-text">
            {format(new Date(plan.startDate), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="user-viewlearningplans-date-item">
          <span className="user-viewlearningplans-date-icon">🏆</span>
          <span className="user-viewlearningplans-date-label">End:</span>
          <span className="user-viewlearningplans-date-text">
            {format(new Date(plan.endDate), 'MMM d, yyyy')}
          </span>
        </div>
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

        <div className="user-viewlearningplans-btn-group">
          <Link to={`/edit-learning-plan/${plan.id}`} className="user-viewlearningplans-btn user-viewlearningplans-btn-edit">
            Edit
          </Link>
          <button 
            onClick={() => confirmDeleteLearningPlan(plan.id, plan.title)} 
            className="user-viewlearningplans-btn user-viewlearningplans-btn-delete"
            aria-label="Delete plan"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const renderPlanRow = (plan) => (
    <div className={`user-viewlearningplans-list-item ${getDueStatus(plan.endDate)}`} key={plan.id}>
      <div className="user-viewlearningplans-list-item-main">
        <div className="user-viewlearningplans-list-item-title-container">
          <h3 className="user-viewlearningplans-list-item-title">{plan.title}</h3>
          <span className={getStatusBadgeClass(plan.status)}>
            {plan.status.replace('_', ' ')}
          </span>
        </div>
        <div className="user-viewlearningplans-list-item-details">
          <div className="user-viewlearningplans-list-item-dates">
            <span className="user-viewlearningplans-date-text">
              {format(new Date(plan.startDate), 'MMM d, yyyy')} - {format(new Date(plan.endDate), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="user-viewlearningplans-progress-container">
            <span className="user-viewlearningplans-progress-percentage">{plan.progressPercentage}%</span>
            <div className="user-viewlearningplans-progress-bar">
              <div 
                className="user-viewlearningplans-progress-fill" 
                style={{ width: `${plan.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="user-viewlearningplans-list-item-actions">

        <Link to={`/edit-learning-plan/${plan.id}`} className="user-viewlearningplans-btn user-viewlearningplans-btn-edit">
          Edit
        </Link>
        <button 
          onClick={() => confirmDeleteLearningPlan(plan.id, plan.title)} 
          className="user-viewlearningplans-btn user-viewlearningplans-btn-delete"
          aria-label="Delete plan"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="user-viewlearningplans-page">
      <NavBar />
      
      <div className="user-viewlearningplans-hero">
        <div className="user-viewlearningplans-hero-content">
          <h1 className="user-viewlearningplans-hero-title">My Learning Journey</h1>
          <p className="user-viewlearningplans-hero-subtitle">Track your progress and achieve your educational goals</p>
        </div>
        <div className="user-viewlearningplans-hero-image">
          <div className="user-viewlearningplans-hero-illustration"></div>
        </div>
      </div>
      
      <div className="user-viewlearningplans-container">
        <div className="user-viewlearningplans-dashboard">
          <div className="user-viewlearningplans-stats">
            <div className="user-viewlearningplans-stat-card">
              <div className="user-viewlearningplans-stat-icon">📚</div>
              <div className="user-viewlearningplans-stat-value">{learningPlans.length}</div>
              <div className="user-viewlearningplans-stat-label">Total Plans</div>
            </div>
            <div className="user-viewlearningplans-stat-card">
              <div className="user-viewlearningplans-stat-icon">⏳</div>
              <div className="user-viewlearningplans-stat-value">
                {learningPlans.filter(plan => plan.status === 'IN_PROGRESS').length}
              </div>
              <div className="user-viewlearningplans-stat-label">In Progress</div>
            </div>
            <div className="user-viewlearningplans-stat-card">
              <div className="user-viewlearningplans-stat-icon">✅</div>
              <div className="user-viewlearningplans-stat-value">
                {learningPlans.filter(plan => plan.status === 'COMPLETED').length}
              </div>
              <div className="user-viewlearningplans-stat-label">Completed</div>
            </div>
            <div className="user-viewlearningplans-stat-card">
              <div className="user-viewlearningplans-stat-icon">⏰</div>
              <div className="user-viewlearningplans-stat-value">
                {learningPlans.filter(plan => {
                  const now = new Date();
                  const due = new Date(plan.endDate);
                  const diffDays = Math.round((due - now) / (1000 * 60 * 60 * 24));
                  return diffDays <= 7 && diffDays >= 0 && plan.status !== 'COMPLETED';
                }).length}
              </div>
              <div className="user-viewlearningplans-stat-label">Due Soon</div>
            </div>
          </div>
          
          <div className="user-viewlearningplans-actions-container">
            <div className="user-viewlearningplans-header">
              <div className="user-viewlearningplans-title-section">
                <h2 className="user-viewlearningplans-title">My Learning Plans</h2>
              </div>
              <Link to="/add-learning-plan" className="user-viewlearningplans-btn user-viewlearningplans-btn-primary">
                <span className="user-viewlearningplans-btn-icon">+</span> Create New Plan
              </Link>
            </div>

            <div className="user-viewlearningplans-filters-container">
              <div className="user-viewlearningplans-filters">
                <div className="user-viewlearningplans-search">
                  <input 
                    type="text" 
                    placeholder="Search plans, topics, or descriptions..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="user-viewlearningplans-search-input"
                  />
                  <span className="user-viewlearningplans-search-icon">🔍</span>
                </div>
                
                <div className="user-viewlearningplans-filter-group">
                  <div className="user-viewlearningplans-filter-status">
                    <label className="user-viewlearningplans-select-label">Status</label>
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
                  
                  <div className="user-viewlearningplans-filter-sort">
                    <label className="user-viewlearningplans-select-label">Sort by</label>
                    <select 
                      value={sortBy} 
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="user-viewlearningplans-select"
                    >
                      <option value="startDate">Start Date</option>
                      <option value="endDate">End Date</option>
                      <option value="title">Title</option>
                      <option value="progress">Progress</option>
                    </select>
                    <button 
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="user-viewlearningplans-btn user-viewlearningplans-btn-icon"
                      title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
                
                <div className="user-viewlearningplans-filter-actions">
                  <button 
                    onClick={clearFilters} 
                    className="user-viewlearningplans-btn user-viewlearningplans-btn-text"
                    disabled={!searchTerm && filterStatus === 'ALL' && sortBy === 'startDate' && sortOrder === 'desc'}
                  >
                    Clear Filters
                  </button>
                  <button 
                    onClick={toggleViewMode} 
                    className="user-viewlearningplans-btn user-viewlearningplans-btn-icon"
                    title={viewMode === 'grid' ? 'List View' : 'Grid View'}
                  >
                    {viewMode === 'grid' ? '≡' : '⊞'}
                  </button>
                </div>
              </div>
            </div>
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
            <div className={viewMode === 'grid' ? 'user-viewlearningplans-grid' : 'user-viewlearningplans-list'}>
              {viewMode === 'grid' 
                ? filteredPlans.map(plan => renderPlanCard(plan))
                : filteredPlans.map(plan => renderPlanRow(plan))
              }
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}