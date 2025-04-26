import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../../css/Comments.css';

const Comments = ({ learningPlanId, userId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = 'http://localhost:8080/api';

  // Fetch comments when component mounts or learningPlanId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${baseUrl}/learning-plans/${learningPlanId}/comments`);
        setComments(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (learningPlanId) {
      fetchComments();
    }
  }, [learningPlanId]);

  // Add a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`${baseUrl}/comments`, {
        content: newComment,
        learningPlanId: learningPlanId,
        userId: userId
      });
      
      setComments([...comments, response.data]);
      setNewComment('');
      setError(null);
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    }
  };

  // Start editing a comment
  const handleEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  // Save edited comment
  const handleSaveEdit = async (id) => {
    try {
      const response = await axios.put(`${baseUrl}/comments/${id}`, {
        content: editContent
      });
      
      setComments(comments.map(comment => 
        comment.id === id ? response.data : comment
      ));
      setEditingId(null);
      setError(null);
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Failed to update comment. Please try again.');
    }
  };

  // Delete a comment
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await axios.delete(`${baseUrl}/comments/${id}`);
        setComments(comments.filter(comment => comment.id !== id));
        setError(null);
      } catch (err) {
        console.error('Error deleting comment:', err);
        setError('Failed to delete comment. Please try again.');
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <div className="comments-loading">Loading comments...</div>;
  }

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      
      {error && <div className="comments-error">{error}</div>}
      
      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows="3"
          required
        />
        <button type="submit" className="btn-submit">Post Comment</button>
      </form>

      {comments.length === 0 ? (
        <p className="no-comments">No comments yet. Be the first to add one!</p>
      ) : (
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-item">
              {editingId === comment.id ? (
                <div className="comment-edit">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows="3"
                  />
                  <div className="comment-actions">
                    <button onClick={() => handleSaveEdit(comment.id)} className="btn-save">Save</button>
                    <button onClick={() => setEditingId(null)} className="btn-cancel">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="comment-header">
                    <span className="comment-user">User #{comment.userId}</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                  {userId === comment.userId && (
                    <div className="comment-actions">
                      <button onClick={() => handleEdit(comment)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(comment.id)} className="btn-delete">Delete</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;