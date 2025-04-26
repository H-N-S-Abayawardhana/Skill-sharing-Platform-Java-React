import React, { useState,userEffect } from 'react';
import '../../CSS/AddLearningPlan.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'


function AddLearningPlan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    topics: [''],
    resources: [''],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTopicChange = (index, value) => {
    const updatedTopics = [...formData.topics];
    updatedTopics[index] = value;
    setFormData({
      ...formData,
      topics: updatedTopics,
    });
  };

  const handleResourceChange = (index, value) => {
    const updatedResources = [...formData.resources];
    updatedResources[index] = value;
    setFormData({
      ...formData,
      resources: updatedResources,
    });
  };

  const addTopic = () => {
    setFormData({
      ...formData,
      topics: [...formData.topics, ''],
    });
  };

  const addResource = () => {
    setFormData({
      ...formData,
      resources: [...formData.resources, ''],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        topics: formData.topics.filter(topic => topic.trim() !== ''),
        resources: formData.resources.filter(resource => resource.trim() !== ''),
        userId: 1, // Replace with actual user ID from auth
        status: 'NOT_STARTED',
        progressPercentage: 0
      };

      await axios.post('http://localhost:8080/api/learning-plan', payload);
      navigate('/learning-plan');
    } catch (error) {
      console.error('Error creating learning plan:', error);
    }
  };

  return (
    <div className="add-learning-plan">
      <h2>Create New Learning Plan</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date:</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Topics:</label>
          {formData.topics.map((topic, index) => (
            <input
              key={index}
              type="text"
              value={topic}
              onChange={(e) => handleTopicChange(index, e.target.value)}
              placeholder="Enter a topic"
            />
          ))}
          <button type="button" onClick={addTopic} className="add-button">
            Add Topic
          </button>
        </div>

        <div className="form-group">
          <label>Resources:</label>
          {formData.resources.map((resource, index) => (
            <input
              key={index}
              type="text"
              value={resource}
              onChange={(e) => handleResourceChange(index, e.target.value)}
              placeholder="Enter a resource (URL, book name, etc.)"
            />
          ))}
          <button type="button" onClick={addResource} className="add-button">
            Add Resource
          </button>
        </div>

        <button type="submit" className="submit-button">
          Create Learning Plan
        </button>
      </form>
    </div>
  );
}

export default AddLearningPlan;
