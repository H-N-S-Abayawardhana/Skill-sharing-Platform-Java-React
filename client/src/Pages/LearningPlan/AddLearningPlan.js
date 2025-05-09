import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import '../../css/AddLearningPlan.css';

export default function AddLearningPlan() {
  const navigate = useNavigate();
  
  const [learningPlan, setLearningPlan] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    topics: [],
    resources: [],
    progressPercentage: 0,
    status: 'NOT_STARTED',
    userId: 1 
  });
  
  const [newTopic, setNewTopic] = useState('');
  const [newResource, setNewResource] = useState({ title: '', url: '' });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});
  
  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!learningPlan.title.trim()) errors.title = "Title is required";
      if (!learningPlan.startDate) errors.startDate = "Start date is required";
      if (!learningPlan.endDate) errors.endDate = "End date is required";
      if (learningPlan.startDate && learningPlan.endDate && 
          new Date(learningPlan.startDate) > new Date(learningPlan.endDate)) {
        errors.endDate = "End date must be after start date";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLearningPlan({ ...learningPlan, [name]: value });
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: null });
    }
  };

  const addTopic = () => {
    if (newTopic.trim() !== '') {
      setLearningPlan({
        ...learningPlan,
        topics: [...learningPlan.topics, newTopic.trim()]
      });
      setNewTopic('');
    }
  };

  const removeTopic = (index) => {
    const updatedTopics = [...learningPlan.topics];
    updatedTopics.splice(index, 1);
    setLearningPlan({ ...learningPlan, topics: updatedTopics });
  };

  const handleResourceChange = (e) => {
    const { name, value } = e.target;
    setNewResource({ ...newResource, [name]: value });
  };

  const addResource = () => {
    if (newResource.title.trim() !== '') {
      const resourceToAdd = newResource.url 
        ? `${newResource.title} (${newResource.url})` 
        : newResource.title;
        
      setLearningPlan({
        ...learningPlan,
        resources: [...learningPlan.resources, resourceToAdd]
      });
      setNewResource({ title: '', url: '' });
    }
  };

  const removeResource = (index) => {
    const updatedResources = [...learningPlan.resources];
    updatedResources.splice(index, 1);
    setLearningPlan({ ...learningPlan, resources: updatedResources });
  };

  const nextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(formStep + 1);
    }
  };

  const prevStep = () => {
    setFormStep(formStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    if (!validateStep(formStep)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await axios.post("http://localhost:8080/api/learning-plan", learningPlan);
      navigate('/');
    } catch (error) {
      console.error("Error creating learning plan:", error);
      setError("Failed to create learning plan. Please try again.");
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <>
      <div className="user-addlearning-plan-step-indicator">
        <div className="user-addlearning-plan-step active">
          <div className="user-addlearning-plan-step-number">1</div>
          <div className="user-addlearning-plan-step-title">Basic Info</div>
        </div>
        <div className="user-addlearning-plan-step-line"></div>
        <div className="user-addlearning-plan-step">
          <div className="user-addlearning-plan-step-number">2</div>
          <div className="user-addlearning-plan-step-title">Topics & Resources</div>
        </div>
      </div>
      
      <div className="user-addlearning-plan-form-section">
        <div className="user-addlearning-plan-form-group">
          <label htmlFor="title" className="user-addlearning-plan-label">
            Learning Plan Title <span className="user-addlearning-plan-required">*</span>
          </label>
          <input
            type="text"
            className={`user-addlearning-plan-input ${validationErrors.title ? 'user-addlearning-plan-input-error' : ''}`}
            id="title"
            name="title"
            value={learningPlan.title}
            onChange={handleInputChange}
            placeholder="E.g., Mastering React Development"
            required
          />
          {validationErrors.title && <div className="user-addlearning-plan-error-message">{validationErrors.title}</div>}
        </div>

        <div className="user-addlearning-plan-form-group">
          <label htmlFor="description" className="user-addlearning-plan-label">Description</label>
          <textarea
            className="user-addlearning-plan-textarea"
            id="description"
            name="description"
            rows="4"
            value={learningPlan.description}
            onChange={handleInputChange}
            placeholder="What do you want to achieve with this learning plan?"
          ></textarea>
        </div>

        <div className="user-addlearning-plan-row">
          <div className="user-addlearning-plan-col">
            <label htmlFor="startDate" className="user-addlearning-plan-label">
              Start Date <span className="user-addlearning-plan-required">*</span>
            </label>
            <input
              type="datetime-local"
              className={`user-addlearning-plan-input ${validationErrors.startDate ? 'user-addlearning-plan-input-error' : ''}`}
              id="startDate"
              name="startDate"
              value={learningPlan.startDate}
              onChange={handleInputChange}
              required
            />
            {validationErrors.startDate && <div className="user-addlearning-plan-error-message">{validationErrors.startDate}</div>}
          </div>
          <div className="user-addlearning-plan-col">
            <label htmlFor="endDate" className="user-addlearning-plan-label">
              End Date <span className="user-addlearning-plan-required">*</span>
            </label>
            <input
              type="datetime-local"
              className={`user-addlearning-plan-input ${validationErrors.endDate ? 'user-addlearning-plan-input-error' : ''}`}
              id="endDate"
              name="endDate"
              value={learningPlan.endDate}
              onChange={handleInputChange}
              required
            />
            {validationErrors.endDate && <div className="user-addlearning-plan-error-message">{validationErrors.endDate}</div>}
          </div>
        </div>
      </div>
      
      <div className="user-addlearning-plan-button-group">
        <Link to="/" className="user-addlearning-plan-button user-addlearning-plan-button-secondary">
          Cancel
        </Link>
        <button 
          type="button" 
          className="user-addlearning-plan-button user-addlearning-plan-button-primary"
          onClick={nextStep}
        >
          Next <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="user-addlearning-plan-step-indicator">
        <div className="user-addlearning-plan-step completed">
          <div className="user-addlearning-plan-step-number">✓</div>
          <div className="user-addlearning-plan-step-title">Basic Info</div>
        </div>
        <div className="user-addlearning-plan-step-line completed"></div>
        <div className="user-addlearning-plan-step active">
          <div className="user-addlearning-plan-step-number">2</div>
          <div className="user-addlearning-plan-step-title">Topics & Resources</div>
        </div>
      </div>
      
      <div className="user-addlearning-plan-form-section">
        <div className="user-addlearning-plan-form-group">
          <label className="user-addlearning-plan-label">Topics to Cover</label>
          <div className="user-addlearning-plan-input-group">
            <input
              type="text"
              className="user-addlearning-plan-input"
              placeholder="Add a topic you want to learn"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
            />
            <button 
              type="button" 
              className="user-addlearning-plan-button-add" 
              onClick={addTopic}
              aria-label="Add topic"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          
          <div className="user-addlearning-plan-tags-container">
            {learningPlan.topics.map((topic, index) => (
              <span key={index} className="user-addlearning-plan-tag">
                {topic}
                <button 
                  type="button" 
                  className="user-addlearning-plan-tag-remove" 
                  aria-label="Remove topic"
                  onClick={() => removeTopic(index)}
                >
                  ×
                </button>
              </span>
            ))}
            {learningPlan.topics.length === 0 && (
              <p className="user-addlearning-plan-placeholder-text">
                No topics added yet. Topics help you organize what you want to learn.
              </p>
            )}
          </div>
        </div>

        <div className="user-addlearning-plan-form-group">
          <label className="user-addlearning-plan-label">Learning Resources</label>
          
          <div className="user-addlearning-plan-resource-form">
            <div className="user-addlearning-plan-row">
              <div className="user-addlearning-plan-col">
                <input
                  type="text"
                  className="user-addlearning-plan-input"
                  placeholder="Resource name (e.g., Book title, Course name)"
                  name="title"
                  value={newResource.title}
                  onChange={handleResourceChange}
                />
              </div>
              <div className="user-addlearning-plan-col">
                <input
                  type="text"
                  className="user-addlearning-plan-input"
                  placeholder="URL (optional)"
                  name="url"
                  value={newResource.url}
                  onChange={handleResourceChange}
                />
              </div>
            </div>
            <button 
              type="button" 
              className="user-addlearning-plan-button user-addlearning-plan-button-outline"
              onClick={addResource}
              disabled={!newResource.title.trim()}
            >
              <i className="fas fa-plus"></i> Add Resource
            </button>
          </div>
          
          <div className="user-addlearning-plan-resources-list">
            {learningPlan.resources.map((resource, index) => (
              <div key={index} className="user-addlearning-plan-resource-item">
                <span>{resource}</span>
                <button 
                  type="button" 
                  className="user-addlearning-plan-resource-remove" 
                  aria-label="Remove resource"
                  onClick={() => removeResource(index)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
            {learningPlan.resources.length === 0 && (
              <p className="user-addlearning-plan-placeholder-text">
                No resources added yet. Resources can include books, courses, websites, videos, etc.
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="user-addlearning-plan-button-group">
        <button 
          type="button" 
          className="user-addlearning-plan-button user-addlearning-plan-button-outline"
          onClick={prevStep}
        >
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <button 
          type="submit" 
          className="user-addlearning-plan-button user-addlearning-plan-button-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="user-addlearning-plan-spinner"></span>
              Creating...
            </>
          ) : (
            <>Create Learning Plan</>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      <NavBar />
      <div className="user-addlearning-plan-container">
        <div className="user-addlearning-plan-card">
          <div className="user-addlearning-plan-card-header">
            <h2>Create Your Learning Plan</h2>
            <p>Define what you want to learn and how you'll track your progress</p>
          </div>
          
          <div className="user-addlearning-plan-card-body">
            {error && (
              <div className="user-addlearning-plan-error-alert">
                <i className="fas fa-exclamation-circle"></i>
                {error}
                <button onClick={() => setError(null)} className="user-addlearning-plan-error-close">×</button>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {formStep === 1 && renderStep1()}
              {formStep === 2 && renderStep2()}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}