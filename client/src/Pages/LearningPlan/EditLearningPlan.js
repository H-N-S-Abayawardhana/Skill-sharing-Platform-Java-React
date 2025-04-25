import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

export default function EditLearningPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [learningPlan, setLearningPlan] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    topics: [],
    resources: [],
    progressPercentage: 0,
    status: 'NOT_STARTED',
    userId: 1  // Assuming a default user ID for simplicity
  });
  
  // For handling topics and resources
  const [newTopic, setNewTopic] = useState('');
  const [newResource, setNewResource] = useState('');

  useEffect(() => {
    loadLearningPlan();
  }, []);

  const loadLearningPlan = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/api/learning-plan/${id}`);
      const plan = result.data;
      
      // Format dates for the input fields
      plan.startDate = formatDateForInput(plan.startDate);
      plan.endDate = formatDateForInput(plan.endDate);
      
      setLearningPlan(plan);
    } catch (error) {
      console.error("Error loading learning plan:", error);
      setError("Failed to load learning plan. It may not exist or has been deleted.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLearningPlan({ ...learningPlan, [name]: value });
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

  const addResource = () => {
    if (newResource.trim() !== '') {
      setLearningPlan({
        ...learningPlan,
        resources: [...learningPlan.resources, newResource.trim()]
      });
      setNewResource('');
    }
  };

  const removeResource = (index) => {
    const updatedResources = [...learningPlan.resources];
    updatedResources.splice(index, 1);
    setLearningPlan({ ...learningPlan, resources: updatedResources });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/learning-plan/${id}`, learningPlan);
      navigate(`/view-learning-plan/${id}`);
    } catch (error) {
      console.error("Error updating learning plan:", error);
      setError("Failed to update learning plan. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-header">
              <h3>Edit Learning Plan</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={learningPlan.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    value={learningPlan.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="startDate"
                      name="startDate"
                      value={learningPlan.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="endDate" className="form-label">End Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="endDate"
                      name="endDate"
                      value={learningPlan.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={learningPlan.status}
                    onChange={handleInputChange}
                  >
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="progressPercentage" className="form-label">
                    Progress: {learningPlan.progressPercentage}%
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    id="progressPercentage"
                    name="progressPercentage"
                    min="0"
                    max="100"
                    value={learningPlan.progressPercentage}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Topics</label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add a topic"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary" 
                      onClick={addTopic}
                    >
                      Add
                    </button>
                  </div>
                  <div>
                    {learningPlan.topics.map((topic, index) => (
                      <span key={index} className="badge bg-light text-dark me-2 mb-2">
                        {topic}
                        <button 
                          type="button" 
                          className="btn-close ms-1" 
                          aria-label="Remove topic"
                          style={{ fontSize: '0.5rem' }}
                          onClick={() => removeTopic(index)}
                        ></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Resources</label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add a resource (URL or text)"
                      value={newResource}
                      onChange={(e) => setNewResource(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary" 
                      onClick={addResource}
                    >
                      Add
                    </button>
                  </div>
                  <ul className="list-group">
                    {learningPlan.resources.map((resource, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {resource}
                        <button 
                          type="button" 
                          className="btn-close" 
                          aria-label="Remove resource"
                          onClick={() => removeResource(index)}
                        ></button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <Link to={`/view-learning-plan/${id}`} className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Update Learning Plan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}