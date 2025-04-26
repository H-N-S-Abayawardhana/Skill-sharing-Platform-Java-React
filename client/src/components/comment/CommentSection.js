import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    
    // For demo purposes, hardcoded userId
    const userId = 1;
    
    useEffect(() => {
        loadComments();
    }, [postId]);
    
    const loadComments = async () => {
        try {
            setLoading(true);
            const result = await axios.get(`http://localhost:8080/api/posts/${postId}/comments`);
            setComments(result.data);
        } catch (error) {
            console.error("Error loading comments:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!newComment.trim()) return;
        
        const comment = {
            content: newComment,
            postId: postId,
            userId: userId
        };
        
        try {
            await axios.post('http://localhost:8080/api/comments', comment);
            setNewComment('');
            loadComments();
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };
    
    const deleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:8080/api/comments/${commentId}`);
            loadComments();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <div className="mt-4">
            <h4>Comments</h4>
            
            {/* Add new comment form */}
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="input-group">
                    <textarea 
                        className="form-control" 
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit" className="btn btn-primary">Post</button>
                </div>
            </form>
            
            {/* Comments list */}
            {loading ? (
                <p>Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="text-muted">No comments yet. Be the first to comment!</p>
            ) : (
                <div className="comment-list">
                    {comments.map(comment => (
                        <div key={comment.id} className="card mb-2">
                            <div className="card-body">
                                <p className="card-text">{comment.content}</p>
                                <div className="d-flex justify-content-between">
                                    <small className="text-muted">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </small>
                                    {comment.userId === userId && (
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => deleteComment(comment.id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}